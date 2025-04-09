import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiClock, FiImage, FiNavigation, FiArrowLeft, FiCheck } from 'react-icons/fi';
import Header from '../../../components/Header';
import { useAuth } from '../../../contexts/AuthContext';
import RestaurantApi from '../../../api/RestaurantApi';
import ModelRestaurant from '../../../model/ModelRestaurant';
import logo from '../../../assets/logo.png';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Correction de l'icône du marqueur
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const restaurantApi = new RestaurantApi();
const CreateRestaurant = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, userRole, hasRestaurant } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    // Récupérer les données sauvegardées du localStorage
    const savedData = localStorage.getItem('restaurantFormData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    // Si pas de données sauvegardées, utiliser les valeurs par défaut
    return {
      name: '',
      picture: '',
      phone: '',
      address: '',
      localisation_latitude: '',
      localisation_longitude: '',
      opening_hours: {
        monday: { open: '', close: '', isClosed: false },
        tuesday: { open: '', close: '', isClosed: false },
        wednesday: { open: '', close: '', isClosed: false },
        thursday: { open: '', close: '', isClosed: false },
        friday: { open: '', close: '', isClosed: false },
        saturday: { open: '', close: '', isClosed: false },
        sunday: { open: '', close: '', isClosed: false }
      }
    };
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(() => {
    // Restaurer l'aperçu de l'image si elle existe
    const savedImage = localStorage.getItem('restaurantImagePreview');
    return savedImage || null;
  });
  const [mapPosition, setMapPosition] = useState(() => {
    // Restaurer la position de la carte si elle existe
    const savedPosition = localStorage.getItem('restaurantMapPosition');
    return savedPosition ? JSON.parse(savedPosition) : [48.8566, 2.3522];
  });
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapRef = useRef(null);

  // Ordre des jours pour l'affichage
  const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  // Noms des jours en français
  const daysNames = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

  // Sauvegarder les données dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('restaurantFormData', JSON.stringify(formData));
  }, [formData]);

  // Sauvegarder la position de la carte
  useEffect(() => {
    localStorage.setItem('restaurantMapPosition', JSON.stringify(mapPosition));
  }, [mapPosition]);

  // Sauvegarder l'aperçu de l'image
  useEffect(() => {
    if (previewImage) {
      localStorage.setItem('restaurantImagePreview', previewImage);
    }
  }, [previewImage]);

  // Nettoyer le localStorage après la création réussie du restaurant
  const clearFormData = () => {
    localStorage.removeItem('restaurantFormData');
    localStorage.removeItem('restaurantImagePreview');
    localStorage.removeItem('restaurantMapPosition');
  };

  const steps = [
    { number: 1, title: 'Informations de base', description: 'Nom, photo et téléphone' },
    { number: 2, title: 'Localisation', description: 'Adresse et position sur la carte' },
    { number: 3, title: 'Horaires', description: 'Horaires d\'ouverture par jour' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpeningHoursChange = (day, type, value) => {
    setFormData(prev => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: {
          ...prev.opening_hours[day],
          [type === 'ouverture' ? 'open' : 'close']: value
        }
      }
    }));
  };

  const handleDayClosed = (day) => {
    setFormData(prev => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: {
          open: '00:00',
          close: '00:00',
          isClosed: !prev.opening_hours[day].isClosed
        }
      }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        picture: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: value
    }));

    // Annuler le timeout précédent s'il existe
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Créer un nouveau timeout pour la recherche
    const timeout = setTimeout(() => {
      if (value.length > 3) { // Ne chercher que si l'adresse a une longueur minimale
        fetchAddressSuggestions(value);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // Attendre 300ms après la dernière frappe

    setSearchTimeout(timeout);
  };

  const fetchAddressSuggestions = async (query) => {
    try {
      setLoading(true);
      
      // Construction de la requête avec plus de détails
      const searchQuery = `${query}, France`;
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.searchParams.append('format', 'json');
      url.searchParams.append('q', searchQuery);
      url.searchParams.append('limit', '5');
      url.searchParams.append('addressdetails', '1');
      url.searchParams.append('countrycodes', 'fr');
      url.searchParams.append('accept-language', 'fr');
      
      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'EasEat/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        setSuggestions(data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const { display_name, lat, lon, address } = suggestion;
    
    // Construction de l'adresse complète avec le numéro
    let fullAddress = '';
    if (address) {
      const parts = [];
      if (address.house_number) parts.push(address.house_number);
      if (address.road) parts.push(address.road);
      if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
      if (address.postcode) parts.push(address.postcode);
      fullAddress = parts.join(', ');
    } else {
      fullAddress = display_name;
    }
    
    setFormData(prev => ({
      ...prev,
      address: fullAddress,
      localisation_latitude: lat,
      localisation_longitude: lon
    }));
    
    setMapPosition([parseFloat(lat), parseFloat(lon)]);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Zoom sur la position si la carte est disponible
    if (mapRef.current) {
      mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 16);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        handleMapClick(e);
      },
    });
    return null;
  };

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    setMapPosition([lat, lng]);
    setFormData(prev => ({
      ...prev,
      localisation_latitude: lat,
      localisation_longitude: lng
    }));

    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setFormData(prev => ({
          ...prev,
          address: data.display_name
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse:', error);
      setError('Impossible de récupérer l\'adresse à cette position');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    setError('');
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.phone) {
          setError('Le nom et le téléphone sont obligatoires');
          return false;
        }
        return true;
      case 2:
        if (!formData.address) {
          setError('L\'adresse est obligatoire');
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === 2) {
        fetchAddressSuggestions(formData.address);
      }
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convertir les coordonnées en float64
      const latitude = parseFloat(formData.localisation_latitude);
      const longitude = parseFloat(formData.localisation_longitude);

      // Vérifier si les coordonnées sont valides
      if (isNaN(latitude) || isNaN(longitude)) {
        setError('Les coordonnées de localisation ne sont pas valides');
        setLoading(false);
        return;
      }

      const api = new RestaurantApi();
      
      // Créer un objet ModelRestaurant
      const restaurantData = new ModelRestaurant();
      restaurantData.name = formData.name;
      restaurantData.phone = formData.phone;
      restaurantData.address = formData.address;
      restaurantData.localisation_latitude = latitude; // Utiliser la valeur convertie
      restaurantData.localisation_longitude = longitude; // Utiliser la valeur convertie
      restaurantData.opening_hours = JSON.stringify(formData.opening_hours);
      
      // Si l'image a changé, la traiter séparément
      if (previewImage && previewImage !== formData.picture) {
        // Convertir l'image en base64 si nécessaire
        const imageData = previewImage;
        restaurantData.picture = imageData;
      }

      console.log('Création du restaurant avec les données:', restaurantData);

      // Appeler l'API avec la méthode correcte
      api.restaurantNewPost(
        restaurantData.name,
        restaurantData.phone,
        restaurantData.address,
        restaurantData.localisation_latitude,
        restaurantData.localisation_longitude,
        restaurantData.picture,
        restaurantData.opening_hours,
        (error, data) => {
          if (error) {
            console.error('Erreur lors de la création du restaurant:', error);
            setError('Erreur lors de la création du restaurant');
            setLoading(false);
            return;
          }
          
          console.log('Restaurant créé avec succès:', data);
          clearFormData();
          navigate('/restaurant/menu');
        }
      );
    } catch (err) {
      console.error('Erreur lors de la création du restaurant:', err);
      setError('Erreur lors de la création du restaurant');
      setLoading(false);
    }
  };

  // Nettoyer le timeout lors du démontage du composant
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <Header />
      <div className="max-w-[800px] mx-auto mt-8 px-4 py-8 w-full">
        <div className="bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-10">
          <Link to="/" className="absolute top-5 left-5 flex items-center text-[#666] text-sm hover:text-[#00a082] transition-colors">
            <FiArrowLeft className="mr-1" /> Retour à l'accueil
          </Link>

          <div className="flex justify-center mb-8">
            <img src={logo} alt="EasEat Logo" className="h-[60px]" />
          </div>

          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold text-[#333] mb-2">
              Créer votre restaurant
            </h1>
            <p className="text-[#666] text-sm">
              Remplissez les informations ci-dessous pour créer votre restaurant
            </p>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center relative">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center relative z-10 flex-1">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-200 
                    ${currentStep > step.number ? 'bg-[#00a082] text-white' : 
                      currentStep === step.number ? 'bg-[#00a082] text-white' : 
                      'bg-[#e0e0e0] text-[#666]'}`}
                  >
                    {currentStep > step.number ? <FiCheck className="w-5 h-5" /> : step.number}
                  </div>
                  <div className="text-center">
                    <p className={`font-medium mb-1 transition-colors duration-200 
                      ${currentStep >= step.number ? 'text-[#333]' : 'text-[#666]'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-[#666] hidden md:block">{step.description}</p>
                  </div>
                </div>
              ))}
              <div className="absolute top-5 left-0 right-0 h-[2px] bg-[#e0e0e0] -z-0">
                <div 
                  className="h-full bg-[#00a082] transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#333]">
                    Nom du restaurant *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nom de votre restaurant"
                      className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a082] focus:border-transparent transition-all duration-200 bg-white"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666]">
                      🍽️
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#333]">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Numéro de téléphone"
                      className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a082] focus:border-transparent transition-all duration-200 bg-white"
                    />
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-[#333]">
                    Image du restaurant
                  </label>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-md aspect-video bg-[#f9f9f9] rounded-lg border-2 border-dashed border-[#e0e0e0] hover:border-[#00a082] transition-colors duration-200 p-4 flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden">
                      {previewImage ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={previewImage} 
                            alt="Aperçu" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <p className="text-white text-sm font-medium">Cliquez pour changer l'image</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <FiImage className="w-12 h-12 text-[#00a082] mb-4" />
                          <div className="text-center">
                            <p className="text-[#333] font-medium mb-1">Glissez et déposez une image ici</p>
                            <p className="text-[#666] text-sm">ou cliquez pour sélectionner un fichier</p>
                          </div>
                        </>
                      )}
                      <input
                        type="file"
                        name="restaurantImage"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-[#666] text-xs text-center">
                      Formats acceptés : JPG, PNG, GIF (max. 5MB)
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#333]">
                    Adresse *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleAddressChange}
                      onFocus={() => formData.address.length > 3 && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      required
                      placeholder="Adresse complète du restaurant (ex: 3 Rue de Bretagne, Paris)"
                      className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a082] focus:border-transparent transition-all duration-200 bg-white"
                      autoComplete="off"
                    />
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666]" />
                    
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-10 w-full bottom-full mb-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion, index) => {
                          const { display_name, address } = suggestion;
                          const mainPart = address ? 
                            `${address.house_number || ''} ${address.road || ''}`.trim() :
                            display_name.split(',')[0];
                          const secondaryPart = address ?
                            `${address.city || address.town || address.village || ''}, ${address.postcode || ''}`.trim() :
                            display_name.split(',').slice(1).join(',').trim();
                          
                          return (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <div className="font-medium">{mainPart}</div>
                              <div className="text-sm text-gray-500">{secondaryPart}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {loading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-[#00a082]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  {error && (
                    <div className="text-sm text-red-600 mt-1">
                      {error}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-[#333]">
                    Localisation sur la carte
                  </label>
                  <div className="relative">
                    <MapContainer 
                      center={mapPosition} 
                      zoom={13} 
                      style={{ height: '400px', width: '100%' }}
                      ref={mapRef}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                      />
                      <MapClickHandler />
                      <Marker 
                        position={mapPosition}
                        draggable={true}
                        eventHandlers={{
                          dragend: (e) => {
                            const { lat, lng } = e.target.getLatLng();
                            handleMapClick({ latlng: { lat, lng } });
                          }
                        }}
                      >
                        <Popup>
                          {formData.name || 'Votre restaurant ici'}
                        </Popup>
                      </Marker>
                    </MapContainer>
                    {loading && (
                      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center">
                          <svg className="animate-spin h-8 w-8 text-[#00a082] mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-[#333] text-sm">Recherche de la localisation...</span>
                        </div>
                      </div>
                    )}
                    <div className="mt-2 text-sm text-[#666]">
                      L'adresse sera automatiquement localisée sur la carte
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiClock className="text-[#00a082] text-xl" />
                  <h3 className="text-lg font-medium text-[#333]">Horaires d'ouverture</h3>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-[#e0e0e0] overflow-hidden">
                  {daysOrder.map((day, index) => {
                    const hours = formData.opening_hours[day];
                    return (
                      <div key={day} className={`flex flex-col md:flex-row items-center p-4 ${index !== 6 ? 'border-b border-[#e0e0e0]' : ''}`}>
                        <div className="w-full md:w-1/3 flex items-center justify-between md:justify-start md:space-x-4 mb-4 md:mb-0">
                          <div className="w-24 text-left">
                            <span className="text-sm font-medium text-[#333]">
                              {daysNames[day]}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={hours.isClosed}
                                onChange={() => handleDayClosed(day)}
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-[#e0e0e0] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00a082]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-[#e0e0e0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a082]"></div>
                            </label>
                            <span className="text-sm font-medium text-[#666] whitespace-nowrap">Fermé</span>
                          </div>
                        </div>
                        <div className="w-full md:w-2/3 flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="relative">
                              <input
                                type="time"
                                value={hours.open}
                                onChange={(e) => handleOpeningHoursChange(day, 'ouverture', e.target.value)}
                                className={`w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a082] focus:border-transparent transition-colors ${hours.isClosed ? 'bg-[#f9f9f9] text-[#999]' : 'bg-white'}`}
                                disabled={hours.isClosed}
                              />
                            </div>
                          </div>
                          <span className="text-[#666]">à</span>
                          <div className="flex-1">
                            <div className="relative">
                              <input
                                type="time"
                                value={hours.close}
                                onChange={(e) => handleOpeningHoursChange(day, 'fermeture', e.target.value)}
                                className={`w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a082] focus:border-transparent transition-colors ${hours.isClosed ? 'bg-[#f9f9f9] text-[#999]' : 'bg-white'}`}
                                disabled={hours.isClosed}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-[#ffebee] border border-[#ffcdd2] text-[#d32f2f] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 border border-[#00a082] text-[#00a082] rounded-lg hover:bg-[#f5f5f5] transition-colors duration-200"
                >
                  Précédent
                </button>
              )}
              <div className="flex-1" />
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-[#00a082] text-white rounded-lg hover:bg-[#008c70] transition-colors duration-200"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#00a082] text-white rounded-lg hover:bg-[#008c70] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Création en cours...
                    </>
                  ) : (
                    'Créer le restaurant'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurant; 
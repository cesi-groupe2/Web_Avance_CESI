import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiClock, FiImage, FiNavigation, FiArrowLeft, FiCheck } from 'react-icons/fi';
import Header from '../../../components/Header';
import { useAuth } from '../../../contexts/AuthContext';
import RestaurantApi from '../../../api/RestaurantApi';
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
      if (value.length > 5) { // Ne chercher que si l'adresse a une longueur minimale
        fetchCoordinates();
      }
    }, 1000); // Attendre 1 seconde après la dernière frappe

    setSearchTimeout(timeout);
  };

  const fetchCoordinates = async () => {
    if (!formData.address) return;
    try {
      setLoading(true);
      console.log('Recherche de coordonnées pour:', formData.address);
      
      // Construction de la requête avec plus de détails
      const searchQuery = `${formData.address}, France`;
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.searchParams.append('format', 'json');
      url.searchParams.append('q', searchQuery);
      url.searchParams.append('limit', '1');
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
      console.log('Réponse de Nominatim:', data);
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        console.log('Coordonnées trouvées:', { lat, lon });
        
        // Mise à jour de la position sur la carte
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        setMapPosition(newPosition);
        
        // Mise à jour des coordonnées dans le formulaire
        setFormData(prev => ({
          ...prev,
          localisation_latitude: lat,
          localisation_longitude: lon
        }));

        // Zoom sur la position
        const map = document.querySelector('.leaflet-container');
        if (map) {
          map._leaflet_map.setView(newPosition, 16);
        }
      } else {
        setError('Adresse non trouvée. Veuillez vérifier l\'adresse et réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des coordonnées:', error);
      setError('Impossible de localiser cette adresse. Veuillez réessayer.');
    } finally {
      setLoading(false);
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
        fetchCoordinates();
      }
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      const restaurantApi = new RestaurantApi();
      
      // Préparation des données pour l'API
      const name = formData.name;
      const phone = formData.phone;
      const address = formData.address;
      const localisationLatitude = formData.localisation_latitude;
      const localisationLongitude = formData.localisation_longitude;
      const picture = formData.picture instanceof File ? formData.picture : null;

      // Préparation des horaires d'ouverture au format JSON
      const openingHoursStr = JSON.stringify(formData.opening_hours);
      console.log('adresse:', address);
      
      // Création d'un objet FormData pour envoyer les données
      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('phone', phone);
      formDataToSend.append('address', address);
      formDataToSend.append('localisation_latitude', localisationLatitude);
      formDataToSend.append('localisation_longitude', localisationLongitude);
      formDataToSend.append('opening_hours', openingHoursStr);
      if (picture) {
        formDataToSend.append('picture', picture);
      }

      // Appel de l'API avec les paramètres requis
      const response = await new Promise((resolve, reject) => {
        restaurantApi.restaurantNewPost(
          name,
          phone,
          address,
          localisationLatitude,
          localisationLongitude,
          picture,
          openingHoursStr,
          (error, data, response) => {
            if (error) {
              reject(error);
            } else {
              resolve({ data, response });
            }
          }
        );
      });

      console.log('Restaurant créé avec succès:', response.data);
      clearFormData(); // Nettoyer le localStorage après la création réussie
      navigate('/restaurant/menuitems');
    } catch (error) {
      console.error('Erreur lors de la création du restaurant:', error);
      setError(error.message || 'Une erreur est survenue lors de la création du restaurant');
    } finally {
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
                      required
                      placeholder="Adresse complète du restaurant (ex: 3 Rue de Bretagne, Paris)"
                      className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a082] focus:border-transparent transition-all duration-200 bg-white"
                      autoComplete="street-address"
                    />
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666]" />
                  </div>
                  {loading && (
                    <div className="text-sm text-[#666] mt-1">
                      Recherche de l'adresse en cours...
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
                      className="w-full h-[400px] rounded-lg shadow-md"
                      style={{ zIndex: 1 }}
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
                <h3 className="text-lg font-medium text-[#333] mb-4">Horaires d'ouverture</h3>
                {Object.entries(formData.opening_hours).map(([day, hours]) => (
                  <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-[#333] capitalize">
                      {day}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleOpeningHoursChange(day, 'ouverture', e.target.value)}
                        className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a082] focus:border-transparent"
                        disabled={hours.isClosed}
                      />
                      <span className="text-[#666]">à</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleOpeningHoursChange(day, 'fermeture', e.target.value)}
                        className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a082] focus:border-transparent"
                        disabled={hours.isClosed}
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hours.isClosed}
                          onChange={() => handleDayClosed(day)}
                          className="w-4 h-4 text-[#00a082] border-[#e0e0e0] rounded focus:ring-[#00a082]"
                        />
                        <span className="text-sm text-[#666]">Fermé ce jour</span>
                      </label>
                    </div>
                  </div>
                ))}
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
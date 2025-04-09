import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiPhone, FiClock, FiImage, FiNavigation, FiArrowLeft, FiSave } from 'react-icons/fi';
import Header from '../../../components/Header';
import { useAuth } from '../../../contexts/AuthContext';
import RestaurantApi from '../../../api/RestaurantApi';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ModelRestaurant from '../../../model/ModelRestaurant';

// Correction de l'icône du marqueur
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EditRestaurant = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
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
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [mapPosition, setMapPosition] = useState([48.8566, 2.3522]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
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

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError('');
        const api = new RestaurantApi();
        api.restaurantMyGet((error, data) => {
          if (error) {
            setError('Erreur lors de la récupération des informations du restaurant');
            setLoading(false);
            return;
          }
          
          if (!data || data.length === 0) {
            setError('Aucun restaurant trouvé');
            setLoading(false);
            return;
          }

          const restaurantData = data[0];
          setRestaurant(restaurantData);
          
          // Parse les horaires d'ouverture si c'est une chaîne de caractères
          const openingHours = typeof restaurantData.opening_hours === 'string' 
            ? JSON.parse(restaurantData.opening_hours)
            : restaurantData.opening_hours;

          setFormData({
            name: restaurantData.name || '',
            phone: restaurantData.phone || '',
            address: restaurantData.address || '',
            localisation_latitude: restaurantData.localisation_latitude || '',
            localisation_longitude: restaurantData.localisation_longitude || '',
            opening_hours: openingHours || {
              monday: { open: '', close: '', isClosed: false },
              tuesday: { open: '', close: '', isClosed: false },
              wednesday: { open: '', close: '', isClosed: false },
              thursday: { open: '', close: '', isClosed: false },
              friday: { open: '', close: '', isClosed: false },
              saturday: { open: '', close: '', isClosed: false },
              sunday: { open: '', close: '', isClosed: false }
            }
          });

          if (restaurantData.localisation_latitude && restaurantData.localisation_longitude) {
            setMapPosition([
              parseFloat(restaurantData.localisation_latitude),
              parseFloat(restaurantData.localisation_longitude)
            ]);
          }

          if (restaurantData.picture) {
            setPreviewImage(restaurantData.picture);
          }

          setLoading(false);
        });
      } catch (err) {
        setError('Erreur lors de la récupération des informations du restaurant');
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

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
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressChange = (e) => {
    const { value } = e.target;
    
    // Validation basique du format d'adresse
    if (value.length > 0 && !/^[0-9\s,.-]+/.test(value)) {
      setError('L\'adresse doit commencer par un numéro');
      return;
    }

    setFormData(prev => ({
      ...prev,
      address: value
    }));

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (value.length > 5) {
        fetchAddressSuggestions(value);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    setSearchTimeout(timeout);
  };

  const fetchAddressSuggestions = async (query) => {
    if (!query) return;
    try {
      setAddressLoading(true);
      setError('');
      
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
      setAddressSuggestions(data || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Erreur lors de la recherche d\'adresses:', err);
      setError('Erreur lors de la recherche d\'adresses. Veuillez réessayer.');
    } finally {
      setAddressLoading(false);
    }
  };

  const MapController = () => {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const newPosition = [lat, lng];
        setMapPosition(newPosition);
        setFormData(prev => ({
          ...prev,
          localisation_latitude: lat,
          localisation_longitude: lng
        }));
        
        // Récupérer l'adresse à partir des coordonnées
        fetchAddressFromCoordinates(lat, lng);
      }
    });
    
    // Stocker la référence de la carte
    mapRef.current = map;
    
    return null;
  };

  // Fonction pour recentrer la carte sur le marqueur
  const centerMapOnMarker = (position) => {
    if (mapRef.current) {
      mapRef.current.setView(position, mapRef.current.getZoom());
    }
  };

  // Fonction pour récupérer l'adresse à partir des coordonnées
  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      setAddressLoading(true);
      setError('');
      
      console.log('Récupération de l\'adresse pour les coordonnées:', lat, lng);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=fr`,
        {
          headers: {
            'User-Agent': 'EasEat/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Réponse de Nominatim (reverse):', data);
      
      if (data && data.display_name) {
        console.log('Adresse trouvée:', data.display_name);
        setFormData(prev => ({
          ...prev,
          address: data.display_name
        }));
      } else {
        console.log('Aucune adresse trouvée pour ces coordonnées');
        setError('Impossible de trouver une adresse à cette position');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'adresse:', err);
      setError('Impossible de récupérer l\'adresse à cette position');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      address: suggestion.display_name
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
    
    const { lat, lon } = suggestion;
    const newPosition = [parseFloat(lat), parseFloat(lon)];
    setMapPosition(newPosition);
    setFormData(prev => ({
      ...prev,
      localisation_latitude: lat,
      localisation_longitude: lon
    }));
    
    // Recentrer la carte sur la nouvelle position
    centerMapOnMarker(newPosition);
  };

  const handleAddressBlur = () => {
    // Attendre un peu avant de cacher les suggestions pour permettre le clic
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleAddressFocus = () => {
    if (addressSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!restaurant || !restaurant.id_restaurant) {
        setError('ID du restaurant non trouvé');
        setLoading(false);
        return;
      }

      const api = new RestaurantApi();
      
      // Créer un objet ModelRestaurant
      const restaurantData = new ModelRestaurant();
      restaurantData.name = formData.name;
      restaurantData.phone = formData.phone;
      restaurantData.address = formData.address;
      restaurantData.localisation_latitude = formData.localisation_latitude;
      restaurantData.localisation_longitude = formData.localisation_longitude;
      restaurantData.opening_hours = JSON.stringify(formData.opening_hours);
      
      // Si l'image a changé, la traiter séparément
      if (previewImage && previewImage !== restaurant.picture) {
        // Convertir l'image en base64 si nécessaire
        const imageData = previewImage;
        restaurantData.picture = imageData;
      }

      console.log('Mise à jour du restaurant avec ID:', restaurant.id_restaurant);
      console.log('Données à envoyer:', restaurantData);

      // Appeler l'API avec l'objet ModelRestaurant
      api.restaurantRestaurantIdPut(restaurant.id_restaurant, restaurantData, (error, data) => {
        if (error) {
          console.error('Erreur lors de la mise à jour du restaurant:', error);
          setError('Erreur lors de la mise à jour du restaurant');
          setLoading(false);
          return;
        }
        
        console.log('Restaurant mis à jour avec succès:', data);
        navigate('/restaurant/menu');
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du restaurant:', err);
      setError('Erreur lors de la mise à jour du restaurant');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des informations du restaurant...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/restaurant/menu')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft className="mr-2" />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">Modifier le restaurant</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                🍽️
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Photo du restaurant
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Aperçu"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <FiImage className="text-gray-400 text-2xl" />
                )}
              </div>
              <p className="text-gray-500 text-sm">
                Cliquez pour changer la photo<br />
                Formats acceptés : JPG, PNG, GIF (max. 5MB)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Adresse *
            </label>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleAddressChange}
                onBlur={handleAddressBlur}
                onFocus={handleAddressFocus}
                required
                placeholder="Adresse complète du restaurant (ex: 3 Rue de Bretagne, Paris)"
                className={`w-full pl-10 pr-12 py-3 border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                autoComplete="street-address"
              />
              <FiMapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                error ? 'text-red-500' : 'text-gray-500'
              }`} />
              {addressLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            {showSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {addressSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Localisation sur la carte
            </label>
            <div className="relative z-10">
              <MapContainer 
                center={mapPosition} 
                zoom={13} 
                className="w-full h-[400px] rounded-lg shadow-md"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <MapController />
                <Marker 
                  position={mapPosition}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const { lat, lng } = e.target.getLatLng();
                      const newPosition = [lat, lng];
                      setMapPosition(newPosition);
                      setFormData(prev => ({
                        ...prev,
                        localisation_latitude: lat,
                        localisation_longitude: lng
                      }));
                      
                      // Recentrer la carte sur la nouvelle position du marqueur
                      centerMapOnMarker(newPosition);
                      
                      // Mettre à jour l'adresse à partir des nouvelles coordonnées
                      fetchAddressFromCoordinates(lat, lng);
                    }
                  }}
                >
                  <Popup>
                    {formData.name || 'Votre restaurant ici'}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <FiClock className="text-green-500 text-xl" />
              <h3 className="text-lg font-medium text-gray-800">Horaires d'ouverture</h3>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {daysOrder.map((day, index) => {
                const hours = formData.opening_hours[day];
                return (
                  <div key={day} className={`flex flex-col md:flex-row items-center p-4 ${index !== 6 ? 'border-b border-gray-200' : ''}`}>
                    <div className="w-full md:w-1/3 flex items-center justify-between md:justify-start md:space-x-4 mb-4 md:mb-0">
                      <span className="text-sm font-medium text-gray-700">
                        {daysNames[day]}
                      </span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hours.isClosed}
                          onChange={() => handleDayClosed(day)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        <span className="ms-3 text-sm font-medium text-gray-500">Fermé</span>
                      </label>
                    </div>
                    <div className="w-full md:w-2/3 flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleOpeningHoursChange(day, 'ouverture', e.target.value)}
                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${hours.isClosed ? 'bg-gray-50 text-gray-400' : 'bg-white'}`}
                            disabled={hours.isClosed}
                          />
                        </div>
                      </div>
                      <span className="text-gray-400">à</span>
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleOpeningHoursChange(day, 'fermeture', e.target.value)}
                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${hours.isClosed ? 'bg-gray-50 text-gray-400' : 'bg-white'}`}
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <FiSave />
              <span>Enregistrer les modifications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurant; 
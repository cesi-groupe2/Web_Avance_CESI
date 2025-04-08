import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiPhone, FiClock, FiImage, FiNavigation, FiArrowLeft, FiSave } from 'react-icons/fi';
import Header from '../../../components/Header';
import { useAuth } from '../../../contexts/AuthContext';
import RestaurantApi from '../../../api/RestaurantApi';
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
    setFormData(prev => ({
      ...prev,
      address: value
    }));

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (value.length > 5) {
        fetchCoordinates();
      }
    }, 1000);

    setSearchTimeout(timeout);
  };

  const fetchCoordinates = async () => {
    if (!formData.address) return;
    try {
      setLoading(true);
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
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        setMapPosition(newPosition);
        setFormData(prev => ({
          ...prev,
          localisation_latitude: lat,
          localisation_longitude: lon
        }));
      } else {
        setError('Adresse non trouvée. Veuillez vérifier l\'adresse et réessayer.');
      }
    } catch (err) {
      setError('Erreur lors de la recherche de l\'adresse');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const api = new RestaurantApi();
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('localisation_latitude', formData.localisation_latitude);
      formDataToSend.append('localisation_longitude', formData.localisation_longitude);
      formDataToSend.append('opening_hours', JSON.stringify(formData.opening_hours));
      
      if (previewImage && previewImage !== restaurant.picture) {
        formDataToSend.append('picture', previewImage);
      }

      api.restaurantRestaurantIdPut(currentUser.restaurantId, formDataToSend, (error, data) => {
        if (error) {
          setError('Erreur lors de la mise à jour du restaurant');
          setLoading(false);
          return;
        }
        
        navigate('/restaurant/menu');
      });
    } catch (err) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur !</strong>
            <span className="block sm:inline"> {error}</span>
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
                required
                placeholder="Adresse complète du restaurant"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            {loading && (
              <div className="text-sm text-gray-500 mt-1">
                Recherche de l'adresse en cours...
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Localisation sur la carte
            </label>
            <div className="relative">
              <MapContainer 
                center={mapPosition} 
                zoom={13} 
                className="w-full h-[400px] rounded-lg shadow-md"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <Marker 
                  position={mapPosition}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const { lat, lng } = e.target.getLatLng();
                      setMapPosition([lat, lng]);
                      setFormData(prev => ({
                        ...prev,
                        localisation_latitude: lat,
                        localisation_longitude: lng
                      }));
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
              {Object.entries(formData.opening_hours).map(([day, hours], index) => (
                <div key={day} className={`flex flex-col md:flex-row items-center p-4 ${index !== 6 ? 'border-b border-gray-200' : ''}`}>
                  <div className="w-full md:w-1/3 flex items-center justify-between md:justify-start md:space-x-4 mb-4 md:mb-0">
                    <span className="text-sm font-medium text-gray-700">
                      {day === 'monday' ? 'Lundi' :
                       day === 'tuesday' ? 'Mardi' :
                       day === 'wednesday' ? 'Mercredi' :
                       day === 'thursday' ? 'Jeudi' :
                       day === 'friday' ? 'Vendredi' :
                       day === 'saturday' ? 'Samedi' : 'Dimanche'}
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
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
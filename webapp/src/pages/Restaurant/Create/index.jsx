import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext';
import RestaurantApi from '../../../api/RestaurantApi';
import ModelRestaurant from '../../../model/ModelRestaurant';
import ModelOpeningHours from '../../../model/ModelOpeningHours';
import { FiInfo, FiMapPin, FiClock } from 'react-icons/fi';

// Import des composants
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import FormSection from '../../../components/FormSection';
import ImageUpload from '../../../components/ImageUpload';
import MapSection from '../../../components/MapSection';
import OpeningHours from '../../../components/OpeningHours';
import FormField from '../../../components/FormField';
import ButtonGroup from '../../../components/ButtonGroup';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
`;

const FormContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
  flex: 1;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Logo = styled.img`
  height: 60px;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  font-weight: 800;

  @media (max-width: 400px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--gray-medium);
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 400px) {
    font-size: 1rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  border: 1px solid #ef4444;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    flex-shrink: 0;
  }
`;

const CreateRestaurant = () => {
  const { currentUser, token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [mapCenter, setMapCenter] = useState([48.8566, 2.3522]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapError, setMapError] = useState(null);

  const [restaurantData, setRestaurantData] = useState({
    name: '',
    address: '',
    phone: '',
    picture: '',
    localisation_latitude: '',
    localisation_longitude: '',
    opening_hours: []
  });

  if (!currentUser || currentUser.role !== '2') {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const handleAddressChange = async (address) => {
    if (!address) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        const newPosition = [parseFloat(location.lat), parseFloat(location.lon)];
        setMapCenter(newPosition);
        setMarkerPosition(newPosition);
        
        setRestaurantData(prev => ({
          ...prev,
          localisation_latitude: location.lat.toString(),
          localisation_longitude: location.lon.toString()
        }));
        setMapError(null);
      } else {
        setMapError('Adresse non trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de la géolocalisation:', error);
      setMapError('Erreur lors de la géolocalisation');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'address') {
      handleAddressChange(value);
    }
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setRestaurantData(prev => {
      const newOpeningHours = [...prev.opening_hours];
      const dayIndex = newOpeningHours.findIndex(h => h.day_of_week === day);
      
      if (dayIndex === -1) {
        newOpeningHours.push({
          day_of_week: day,
          opening_time: field === 'opening_time' ? value : '',
          closing_time: field === 'closing_time' ? value : '',
          is_closed: false
        });
      } else {
        newOpeningHours[dayIndex] = {
          ...newOpeningHours[dayIndex],
          [field]: value
        };
      }

      return {
        ...prev,
        opening_hours: newOpeningHours
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Veuillez sélectionner une image valide (JPG, PNG, etc.)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setRestaurantData(prev => ({
        ...prev,
        picture: file
      }));
    }
  };

  const updateAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.address) {
        const address = data.address;
        const formattedAddress = [
          address.house_number,
          address.road,
          address.postcode,
          address.city
        ].filter(Boolean).join(' ');

        setRestaurantData(prev => ({
          ...prev,
          address: formattedAddress
        }));
        setMapError(null);
      } else {
        setMapError('Adresse non trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse:', error);
      setMapError('Erreur lors de la récupération de l\'adresse');
    }
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const newPosition = [lat, lng];
    setMarkerPosition(newPosition);
    setMapCenter(newPosition);
    
    setRestaurantData(prev => ({
      ...prev,
      localisation_latitude: lat.toString(),
      localisation_longitude: lng.toString()
    }));

    updateAddressFromCoordinates(lat, lng);
  };

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    const newPosition = [lat, lng];
    setMarkerPosition(newPosition);
    setRestaurantData(prev => ({
      ...prev,
      localisation_latitude: lat.toString(),
      localisation_longitude: lng.toString()
    }));
    updateAddressFromCoordinates(lat, lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!restaurantData.name || !restaurantData.address || !restaurantData.phone || 
          !restaurantData.localisation_latitude || !restaurantData.localisation_longitude) {
        setError('Veuillez remplir tous les champs obligatoires');
        setLoading(false);
        return;
      }

      const phoneRegex = /^[0-9+\s-]{10,}$/;
      if (!phoneRegex.test(restaurantData.phone)) {
        setError('Veuillez entrer un numéro de téléphone valide');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      
      formData.append('name', restaurantData.name);
      formData.append('address', restaurantData.address);
      formData.append('phone', restaurantData.phone.trim());
      formData.append('localisation_latitude', restaurantData.localisation_latitude);
      formData.append('localisation_longitude', restaurantData.localisation_longitude);
      
      if (restaurantData.picture instanceof File) {
        formData.append('picture', restaurantData.picture);
      }
      
      formData.append('opening_hours', JSON.stringify(restaurantData.opening_hours));

      const restaurantApi = new RestaurantApi();
      const response = await new Promise((resolve, reject) => {
        restaurantApi.restaurantPost(
          restaurantData.name,
          restaurantData.address,
          restaurantData.phone,
          restaurantData.localisation_latitude,
          restaurantData.localisation_longitude,
          restaurantData.opening_hours,
          { headers: { 'Authorization': `Bearer ${token}` } },
          (error, data, response) => {
            if (error) {
              console.error('Erreur API:', error);
              reject(error);
              return;
            }
            resolve({ data, response });
          }
        );
      });

      if (response.response.status === 201) {
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/restaurants', { replace: true });
      } else {
        throw new Error('Erreur lors de la création du restaurant');
      }
    } catch (error) {
      console.error('Erreur lors de la création du restaurant:', error);
      setError('Une erreur est survenue lors de la création du restaurant. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <PageContainer>
        <FormContainer>
          <FormHeader>
            <Title>Créez votre restaurant</Title>
            <Subtitle>
              Rejoignez notre plateforme et commencez à recevoir des commandes dès aujourd'hui
            </Subtitle>
          </FormHeader>

          {error && (
            <ErrorMessage>
              <FiInfo />
              {error}
            </ErrorMessage>
          )}

          <form onSubmit={handleSubmit}>
            <FormSection title="Informations générales" icon={<FiInfo />} grid>
              <ImageUpload 
                previewImage={previewImage}
                onImageChange={handleImageChange}
              />
              <div>
                <FormField
                  label="Nom du restaurant"
                  name="name"
                  value={restaurantData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Le Petit Bistrot"
                />
                <FormField
                  label="Téléphone"
                  name="phone"
                  value={restaurantData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: 01 23 45 67 89"
                  pattern="[0-9+\s-]{10,}"
                />
              </div>
            </FormSection>

            <FormSection title="Localisation" icon={<FiMapPin />}>
              <FormField
                label="Adresse"
                name="address"
                value={restaurantData.address}
                onChange={handleInputChange}
                required
                placeholder="Ex: 123 rue de la Paix, 75001 Paris"
              />
              {mapError && <ErrorMessage>{mapError}</ErrorMessage>}
              
              <MapSection
                center={mapCenter}
                markerPosition={markerPosition}
                onMapClick={handleMapClick}
                onMarkerDragEnd={handleMarkerDragEnd}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormField
                  label="Latitude"
                  name="localisation_latitude"
                  value={restaurantData.localisation_latitude}
                  readOnly
                  disabled
                />
                <FormField
                  label="Longitude"
                  name="localisation_longitude"
                  value={restaurantData.localisation_longitude}
                  readOnly
                  disabled
                />
              </div>
            </FormSection>

            <FormSection title="Horaires d'ouverture" icon={<FiClock />}>
              <OpeningHours
                openingHours={restaurantData.opening_hours}
                onChange={handleOpeningHoursChange}
              />
            </FormSection>

            <ButtonGroup
              onCancel={() => navigate('/restaurants')}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </form>
        </FormContainer>
      </PageContainer>
      <Footer />
    </>
  );
};

export default CreateRestaurant; 
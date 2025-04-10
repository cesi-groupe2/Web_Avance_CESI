import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMapPin, FiUser, FiRefreshCw, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import DeliveryPersonApi from '../../api/DeliveryPersonApi';
import DeliverypersonSetStatusStatusPostRequest from '../../model/DeliverypersonSetStatusStatusPostRequest';
import { useAuth } from '../../contexts/AuthContext';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatusSection = styled.div`
  margin-bottom: 30px;
`;

const StatusTitle = styled.h2`
  font-size: 1.4rem;
  color: #444;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const StatusOption = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  background-color: ${props => props.selected ? '#00a082' : '#f5f5f5'};
  color: ${props => props.selected ? 'white' : '#333'};
  border: none;
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${props => props.selected ? '#008f73' : '#e9e9e9'};
  }
`;

const LocationSection = styled.div`
  margin-bottom: 20px;
`;

const LocationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: ${props => props.active ? '#00a082' : '#ff6b6b'};
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #00a082;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #008f73;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const NearbyDeliveryPersons = styled.div`
  margin-top: 30px;
`;

const DeliveryPersonList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
`;

const DeliveryPersonCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DeliveryPersonStatus = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  background-color: ${props => {
    switch (props.status) {
      case 'available': return '#e3fcef';
      case 'busy': return '#fff4e5';
      case 'offline': return '#f0f0f0';
      default: return '#f0f0f0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'available': return '#00a082';
      case 'busy': return '#ff9800';
      case 'offline': return '#777777';
      default: return '#777777';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #777;
`;

const MapPreview = styled.div`
  height: 250px;
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  border: 1px dashed #ccc;
`;

const DeliveryStatus = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const deliveryPersonApi = new DeliveryPersonApi();
  
  const [status, setStatus] = useState('offline');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearbyDeliveryPersons, setNearbyDeliveryPersons] = useState([]);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated or not a delivery person
    if (!isAuthenticated || userRole !== "3") {
      navigate("/");
      return;
    }

    // Request location permission and get current position
    getLocationPermission();
  }, [isAuthenticated, userRole, navigate]);

  // Get location permission and position
  const getLocationPermission = () => {
    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLocationError(null);
        loadNearbyDeliveryPersons(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        setLocationError(
          error.code === 1
            ? "Vous avez refusé l'accès à votre position. Veuillez l'activer pour utiliser cette fonctionnalité."
            : "Impossible de déterminer votre position. Veuillez réessayer."
        );
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Load nearby delivery persons
  const loadNearbyDeliveryPersons = (latitude, longitude) => {
    setLoading(true);
    deliveryPersonApi.deliverypersonGetStatusNearbyLatitudeLongitudeGet(
      latitude.toString(),
      longitude.toString(),
      (error, data, response) => {
        if (error) {
          console.error("Erreur lors du chargement des livreurs à proximité:", error);
          toast.error("Impossible de charger les livreurs à proximité");
        } else {
          setNearbyDeliveryPersons(data || []);
        }
        setLoading(false);
      }
    );
  };

  // Update delivery person status
  const updateStatus = () => {
    if (!location) {
      toast.error("Position non disponible. Veuillez activer votre géolocalisation.");
      return;
    }

    setLoading(true);
    const requestData = new DeliverypersonSetStatusStatusPostRequest(
      location.longitude.toString(),
      location.latitude.toString()
    );

    deliveryPersonApi.deliverypersonSetStatusStatusPost(
      status,
      requestData,
      (error, data, response) => {
        if (error) {
          console.error("Erreur lors de la mise à jour du statut:", error);
          toast.error("Impossible de mettre à jour votre statut");
        } else {
          toast.success(`Statut mis à jour: ${getStatusDisplay(status)}`);
          // Refresh nearby delivery persons list
          loadNearbyDeliveryPersons(location.latitude, location.longitude);
        }
        setLoading(false);
      }
    );
  };

  // Get human-readable status display
  const getStatusDisplay = (statusCode) => {
    switch (statusCode) {
      case 'available': return 'Disponible';
      case 'busy': return 'Occupé';
      case 'offline': return 'Hors ligne';
      default: return statusCode;
    }
  };

  // Refresh location and data
  const refreshLocation = () => {
    getLocationPermission();
  };

  return (
    <>
      <Header />
      <Container>
        <Card>
          <Title><FiUser /> Gestion du statut de livraison</Title>
          
          {locationError ? (
            <EmptyState>
              <FiAlertCircle size={40} style={{ marginBottom: '15px' }} />
              <p>{locationError}</p>
              <Button onClick={refreshLocation} style={{ margin: '15px auto', display: 'flex' }}>
                <FiRefreshCw /> Réessayer
              </Button>
            </EmptyState>
          ) : (
            <>
              <LocationSection>
                <StatusTitle><FiMapPin /> Position actuelle</StatusTitle>
                <LocationStatus active={location !== null}>
                  {location ? (
                    <>
                      <FiCheckCircle /> Position détectée: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </>
                  ) : (
                    <>
                      <FiAlertCircle /> Position non détectée
                    </>
                  )}
                </LocationStatus>
                <Button onClick={refreshLocation} disabled={loading}>
                  <FiRefreshCw /> Actualiser ma position
                </Button>
              </LocationSection>

              <StatusSection>
                <StatusTitle>Choisir mon statut</StatusTitle>
                <StatusOptions>
                  <StatusOption 
                    onClick={() => setStatus('available')} 
                    selected={status === 'available'}>
                    🟢 Disponible
                  </StatusOption>
                  <StatusOption 
                    onClick={() => setStatus('busy')} 
                    selected={status === 'busy'}>
                    🟠 Occupé
                  </StatusOption>
                  <StatusOption 
                    onClick={() => setStatus('offline')} 
                    selected={status === 'offline'}>
                    ⚫ Hors ligne
                  </StatusOption>
                </StatusOptions>
                <Button onClick={updateStatus} disabled={loading || !location}>
                  {loading ? 'Mise à jour...' : 'Mettre à jour mon statut'}
                </Button>
              </StatusSection>
            </>
          )}
        </Card>

        <Card>
          <StatusTitle>Livreurs à proximité</StatusTitle>
          {loading ? (
            <p>Chargement des livreurs à proximité...</p>
          ) : nearbyDeliveryPersons.length > 0 ? (
            <DeliveryPersonList>
              {nearbyDeliveryPersons.map((deliveryPerson, index) => (
                <DeliveryPersonCard key={index}>
                  <h3>Livreur #{deliveryPerson.idUser}</h3>
                  <p>Position: {deliveryPerson.latitude?.toFixed(6)}, {deliveryPerson.longitude?.toFixed(6)}</p>
                  <DeliveryPersonStatus status={deliveryPerson.status}>
                    {getStatusDisplay(deliveryPerson.status)}
                  </DeliveryPersonStatus>
                </DeliveryPersonCard>
              ))}
            </DeliveryPersonList>
          ) : (
            <EmptyState>
              <p>Aucun livreur à proximité pour le moment</p>
            </EmptyState>
          )}
        </Card>
      </Container>
    </>
  );
};

export default DeliveryStatus; 
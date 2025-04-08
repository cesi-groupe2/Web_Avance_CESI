import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FiClock, FiMapPin, FiPhone } from "react-icons/fi";

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 180px;
  overflow: hidden;
`;

const RestaurantImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const ContentContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const RestaurantName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
`;

const RestaurantDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RestaurantMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
  
  svg {
    margin-right: 8px;
    color: #00a082;
  }
`;

const formatOpeningHours = (hoursJson) => {
  try {
    console.log('Horaires reçus:', hoursJson);
    
    // Si hoursJson est déjà un objet, pas besoin de le parser
    const hours = typeof hoursJson === 'string' ? JSON.parse(hoursJson) : hoursJson;
    
    if (!hours || typeof hours !== 'object') {
      console.log('Format d\'horaires invalide:', hours);
      return "Horaires non disponibles";
    }

    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayHours = hours[days[today]];
    
    console.log('Horaires du jour:', todayHours);
    
    if (!todayHours) {
      console.log('Pas d\'horaires pour aujourd\'hui');
      return "Horaires non disponibles";
    }
    
    if (todayHours.isClosed) {
      return "Fermé aujourd'hui";
    }
    
    return `Ouvert aujourd'hui ${todayHours.open} - ${todayHours.close}`;
  } catch (error) {
    console.error('Erreur lors du parsing des horaires:', error, hoursJson);
    return "Horaires non disponibles";
  }
};

const formatCoordinates = (lat, lon) => {
  try {
    console.log('Coordonnées reçues:', { lat, lon });
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      console.log('Coordonnées invalides:', { latitude, longitude });
      return "Coordonnées non disponibles";
    }
    
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    console.error('Erreur lors du formatage des coordonnées:', error, { lat, lon });
    return "Coordonnées non disponibles";
  }
};

// Composant de carte de restaurant
const RestaurantCard = ({ 
  id_restaurant, 
  name, 
  address, 
  picture, 
  phone, 
  opening_hours,
  localisation_latitude,
  localisation_longitude
}) => {
  console.log('Props reçues:', { id_restaurant, name, address, picture, phone, opening_hours, localisation_latitude, localisation_longitude });
  
  return (
    <Card to={`/restaurant/${id_restaurant}`}>
      <ImageContainer>
        <RestaurantImage 
          src={picture || 'https://via.placeholder.com/400x200?text=Restaurant'} 
          alt={name} 
        />
      </ImageContainer>
      
      <ContentContainer>
        <RestaurantName>{name}</RestaurantName>
        <RestaurantDescription>{address}</RestaurantDescription>
        <RestaurantMeta>
          <MetaItem>
            <FiPhone /> {phone}
          </MetaItem>
          <MetaItem>
            <FiClock /> {formatOpeningHours(opening_hours)}
          </MetaItem>
          <MetaItem>
            <FiMapPin /> {formatCoordinates(localisation_latitude, localisation_longitude)}
          </MetaItem>
        </RestaurantMeta>
      </ContentContainer>
    </Card>
  );
};

RestaurantCard.propTypes = {
  id_restaurant: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  picture: PropTypes.string,
  phone: PropTypes.string.isRequired,
  opening_hours: PropTypes.string.isRequired,
  localisation_latitude: PropTypes.number.isRequired,
  localisation_longitude: PropTypes.number.isRequired
};

RestaurantCard.defaultProps = {
  picture: ''
};

export default RestaurantCard; 
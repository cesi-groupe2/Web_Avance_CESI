import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FiClock, FiStar, FiHeart } from "react-icons/fi";

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

const PromoTag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: #FF5A5F;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  svg {
    color: ${props => props.isFavorite ? '#FF5A5F' : '#666'};
    font-size: 16px;
  }
  
  &:hover svg {
    color: #FF5A5F;
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

const Categories = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  
  svg {
    margin-right: 6px;
    font-size: 16px;
    color: #00a082;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    color: #FFD700;
  }
`;

const DeliveryTime = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
`;

const DeliveryFee = styled.div`
  font-size: 14px;
  color: ${props => props.isFree ? '#00a082' : '#666'};
  font-weight: ${props => props.isFree ? '600' : '400'};
  margin-top: 8px;
`;

// Composant de carte de restaurant
const RestaurantCard = ({ 
  id, 
  name, 
  imageUrl, 
  categories, 
  rating, 
  deliveryTime, 
  deliveryFee, 
  promotion, 
  isFavorite, 
  onToggleFavorite 
}) => {
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    onToggleFavorite(id);
  };

  const isFreeDelivery = deliveryFee === 0;

  return (
    <Card to={`/restaurants/${id}`}>
      <ImageContainer>
        <RestaurantImage src={imageUrl} alt={name} />
        {promotion && <PromoTag>{promotion}</PromoTag>}
        <FavoriteButton 
          isFavorite={isFavorite} 
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <FiHeart fill={isFavorite ? "#FF5A5F" : "none"} />
        </FavoriteButton>
      </ImageContainer>
      
      <ContentContainer>
        <RestaurantName>{name}</RestaurantName>
        <Categories>{categories.join(" • ")}</Categories>
        
        <InfoRow>
          <Rating>
            <FiStar />
            <span>{rating.toFixed(1)}</span>
          </Rating>
          
          <DeliveryTime>
            <FiClock />
            <span>{deliveryTime} min</span>
          </DeliveryTime>
        </InfoRow>
        
        <DeliveryFee isFree={isFreeDelivery}>
          {isFreeDelivery ? "Livraison gratuite" : `Livraison ${deliveryFee.toFixed(2)} €`}
        </DeliveryFee>
      </ContentContainer>
    </Card>
  );
};

RestaurantCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  rating: PropTypes.number.isRequired,
  deliveryTime: PropTypes.number.isRequired,
  deliveryFee: PropTypes.number.isRequired,
  promotion: PropTypes.string,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func
};

RestaurantCard.defaultProps = {
  promotion: null,
  isFavorite: false,
  onToggleFavorite: () => {}
};

export default RestaurantCard; 
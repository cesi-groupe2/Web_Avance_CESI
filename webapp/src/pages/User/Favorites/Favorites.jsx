import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useFavorites } from '../../../contexts/FavoritesContext';
import Header from '../../../components/Header';
import Button from '../../../components/Button/Button';
import { FiHeart, FiClock, FiStar } from 'react-icons/fi';
import dodoImage from '../../../assets/dodo.jpg';

const FavoritesContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const FavoritesTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

const EmptyFavoritesMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const EmptyFavoritesText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #666;
`;

const EmptyFavoritesImage = styled.img`
  max-width: 300px;
  margin: 2rem auto;
  display: block;
  border-radius: 8px;
`;

const RestaurantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RestaurantCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const RestaurantLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const RestaurantImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const RestaurantInfo = styled.div`
  padding: 1.5rem;
`;

const RestaurantName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const RestaurantDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RestaurantMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.3rem;
  }
  
  & > div {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }
`;

const RestaurantRating = styled.div`
  display: flex;
  align-items: center;
  color: #ffa534;
`;

const RemoveFavoriteButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: #f44336;
  
  &:hover {
    background-color: #f44336;
    color: #ffffff;
  }
`;

const CardWrapper = styled.div`
  position: relative;
`;

const Favorites = () => {
  const { favorites, removeFavorite, loading } = useFavorites();
  
  const handleRemoveFavorite = (e, restaurantId) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(restaurantId);
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <FavoritesContainer>
          <FavoritesTitle>Mes Restaurants Favoris</FavoritesTitle>
          <p>Chargement des favoris...</p>
        </FavoritesContainer>
      </>
    );
  }
  
  if (favorites.length === 0) {
    return (
      <>
        <Header />
        <FavoritesContainer>
          <FavoritesTitle>Mes Restaurants Favoris</FavoritesTitle>
          <EmptyFavoritesMessage>
            <EmptyFavoritesText>(à implementer)</EmptyFavoritesText>
              <EmptyFavoritesImage src={dodoImage} alt="Dodo <3" />
            <Button as={Link} to="/restaurants">
              Découvrir des restaurants
            </Button>
          </EmptyFavoritesMessage>
        </FavoritesContainer>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <FavoritesContainer>
        <FavoritesTitle>Mes Restaurants Favoris</FavoritesTitle>
        
        <RestaurantsGrid>
          {favorites.map((restaurant) => (
            <CardWrapper key={restaurant.id}>
              <RestaurantCard>
                <RestaurantLink to={`/restaurant/${restaurant.id}`}>
                  <RestaurantImage 
                    src={restaurant.image || 'https://via.placeholder.com/400x200?text=Restaurant'} 
                    alt={restaurant.name}
                  />
                  <RestaurantInfo>
                    <RestaurantName>{restaurant.name}</RestaurantName>
                    <RestaurantDescription>{restaurant.description || 'Description non disponible'}</RestaurantDescription>
                    <RestaurantMeta>
                      <div>
                        <FiClock /> {restaurant.deliveryTime || '30-45 min'}
                      </div>
                      <RestaurantRating>
                        <FiStar /> {restaurant.rating || '4.5'}
                      </RestaurantRating>
                    </RestaurantMeta>
                  </RestaurantInfo>
                </RestaurantLink>
              </RestaurantCard>
              <RemoveFavoriteButton 
                onClick={(e) => handleRemoveFavorite(e, restaurant.id)}
                aria-label="Retirer des favoris"
              >
                <FiHeart />
              </RemoveFavoriteButton>
            </CardWrapper>
          ))}
        </RestaurantsGrid>
      </FavoritesContainer>
    </>
  );
};

export default Favorites; 
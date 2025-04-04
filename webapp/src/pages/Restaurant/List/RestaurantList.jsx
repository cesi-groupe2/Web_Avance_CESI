import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../../components/Header";
import RestaurantCard from "../../../components/RestaurantCard/RestaurantCard";
import { useAuth } from "../../../contexts/AuthContext";
import { FiSearch, FiFilter, FiSliders, FiHeart, FiClock, FiStar, FiMapPin } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { useFavorites } from '../../../contexts/FavoritesContext';
import RestaurantApi from "../../../api/RestaurantApi";

// Instance de l'API Restaurant
const restaurantApi = new RestaurantApi();

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 24px;
`;

const SearchSection = styled.div`
  margin-bottom: 32px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
`;

const SearchIcon = styled(FiSearch)`
  color: #666;
  font-size: 20px;
  margin-right: 12px;
`;

const SearchInput = styled.input`
  border: none;
  flex-grow: 1;
  font-size: 16px;
  outline: none;
  
  &::placeholder {
    color: #999;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  &::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${props => props.active ? '#00a082' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid ${props => props.active ? '#00a082' : '#e0e0e0'};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#00a082' : '#f5f5f5'};
  }
  
  svg {
    margin-right: 6px;
  }
`;

const RestaurantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 1rem;
  }
`;

const RestaurantsContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const RestaurantsTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
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

const FavoriteButton = styled.button`
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
  color: ${props => props.isFavorite ? '#f44336' : '#666'};
  
  &:hover {
    background-color: ${props => props.isFavorite ? '#f44336' : '#00a082'};
    color: #ffffff;
  }
`;

const CardWrapper = styled.div`
  position: relative;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

// Liste des catégories pour les filtres
const categories = [
  "Tous",
  "Fast food", 
  "Pizza", 
  "Burger", 
  "Asiatique", 
  "Japonais", 
  "Italien", 
  "Mexicain", 
  "Kebab",
  "Sushi",
  "Vietnamien"
];

const RestaurantList = () => {
  const { isAuthenticated, userRole } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    console.log("État d'authentification dans RestaurantList:", { isAuthenticated, userRole });
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        // Dans un cas réel, vous utiliseriez l'API de géolocalisation pour obtenir les coordonnées
        const latitude = 48.856614; // Paris
        const longitude = 2.3522219;
        const kmAround = 10;
        
        // Utilisation de l'API Restaurant
        restaurantApi.restaurantNearbyLatitudeLongitudeKmAroundGet(
          latitude.toString(), 
          longitude.toString(), 
          kmAround.toString(), 
          (error, data, response) => {
            if (error) {
              console.error('Erreur API:', error);
              throw new Error('Erreur lors de la récupération des restaurants');
            }
            
            console.log('Restaurants récupérés:', data);
            setRestaurants(data || []);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
        
        // Données de secours en cas d'erreur
        setRestaurants([
          {
            id_restaurant: 1,
            name: "Le Petit Bistro",
            description: "Cuisine française traditionnelle dans un cadre chaleureux et convivial.",
            picture: "https://via.placeholder.com/400x200?text=Le+Petit+Bistro",
            rating: 4.7,
            deliveryTime: "25-40 min"
          },
          {
            id_restaurant: 2,
            name: "Sushi Express",
            description: "Les meilleurs sushis de la ville, préparés avec des ingrédients frais et de qualité.",
            picture: "https://via.placeholder.com/400x200?text=Sushi+Express",
            rating: 4.5,
            deliveryTime: "20-35 min"
          },
          {
            id_restaurant: 3,
            name: "Pizza Napoli",
            description: "Pizzas authentiques cuites au feu de bois, comme à Naples.",
            picture: "https://via.placeholder.com/400x200?text=Pizza+Napoli",
            rating: 4.8,
            deliveryTime: "30-45 min"
          },
          {
            id_restaurant: 4,
            name: "Burger Palace",
            description: "Des burgers gourmets avec des ingrédients de qualité et des frites maison.",
            picture: "https://via.placeholder.com/400x200?text=Burger+Palace",
            rating: 4.6,
            deliveryTime: "15-30 min"
          },
          {
            id_restaurant: 5,
            name: "Thai Spice",
            description: "Cuisine thaïlandaise authentique aux saveurs exotiques et épicées.",
            picture: "https://via.placeholder.com/400x200?text=Thai+Spice",
            rating: 4.4,
            deliveryTime: "35-50 min"
          },
          {
            id_restaurant: 6,
            name: "Pasta & Co",
            description: "Pâtes fraîches et sauces maison, comme dans les meilleures trattorias italiennes.",
            picture: "https://via.placeholder.com/400x200?text=Pasta+%26+Co",
            rating: 4.3,
            deliveryTime: "25-40 min"
          }
        ]);
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };
  
  const handleFavoriteToggle = (e, restaurant) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(restaurant.id_restaurant)) {
      removeFavorite(restaurant.id_restaurant);
    } else {
      addFavorite(restaurant);
    }
  };
  
  // Filtrer les restaurants en fonction du terme de recherche
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <>
        <Header />
        <RestaurantsContainer>
          <RestaurantsTitle>Restaurants</RestaurantsTitle>
          <LoadingMessage>Chargement des restaurants...</LoadingMessage>
        </RestaurantsContainer>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <RestaurantsContainer>
        <RestaurantsTitle>Restaurants</RestaurantsTitle>
        
        <SearchBar>
          <SearchIcon />
          <SearchInput 
            type="text" 
            placeholder="Rechercher un restaurant" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchBar>
        
        <FiltersContainer>
          {categories.map((category) => (
            <FilterButton key={category}>
              {category}
            </FilterButton>
          ))}
        </FiltersContainer>
        
        {filteredRestaurants.length === 0 ? (
          <EmptyMessage>
            <p>Aucun restaurant ne correspond à votre recherche.</p>
          </EmptyMessage>
        ) : (
          <RestaurantsGrid>
            {filteredRestaurants.map((restaurant) => (
              <CardWrapper key={restaurant.id_restaurant}>
                <RestaurantCard>
                  <RestaurantLink to={`/restaurant/${restaurant.id_restaurant}`}>
                    <RestaurantImage 
                      src={restaurant.picture || 'https://via.placeholder.com/400x200?text=Restaurant'} 
                      alt={restaurant.name}
                    />
                    <RestaurantInfo>
                      <RestaurantName>{restaurant.name}</RestaurantName>
                      <RestaurantDescription>{restaurant.address}</RestaurantDescription>
                      <RestaurantMeta>
                        <div>
                          <FiClock /> {restaurant.opening_hours || "30-45 min"}
                        </div>
                        <RestaurantRating>
                          <FiStar /> {restaurant.rating || "4.5"}
                        </RestaurantRating>
                      </RestaurantMeta>
                    </RestaurantInfo>
                  </RestaurantLink>
                </RestaurantCard>
                <FavoriteButton 
                  isFavorite={isFavorite(restaurant.id_restaurant)}
                  onClick={(e) => handleFavoriteToggle(e, restaurant)}
                  aria-label={isFavorite(restaurant.id_restaurant) ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <FiHeart />
                </FavoriteButton>
              </CardWrapper>
            ))}
          </RestaurantsGrid>
        )}
      </RestaurantsContainer>
    </>
  );
};

export default RestaurantList; 
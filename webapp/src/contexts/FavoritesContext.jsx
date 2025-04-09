import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Charger les favoris depuis le localStorage au démarrage
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        // Utiliser uniquement les favoris stockés localement
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [currentUser]);

  // Sauvegarder les favoris dans le localStorage lorsqu'ils changent
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, loading]);

  // Ajouter un restaurant aux favoris
  const addFavorite = async (restaurant) => {
    const isAlreadyFavorite = favorites.some(fav => fav.id === restaurant.id);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, restaurant];
      setFavorites(updatedFavorites);
    }
  };

  // Supprimer un restaurant des favoris
  const removeFavorite = async (restaurantId) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== restaurantId);
    setFavorites(updatedFavorites);
  };

  // Vérifier si un restaurant est dans les favoris
  const isFavorite = (restaurantId) => {
    return favorites.some(fav => fav.id === restaurantId);
  };

  const value = {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

FavoritesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FavoritesContext; 
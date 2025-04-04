import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, token } = useAuth();

  // Charger les favoris depuis l'API ou le localStorage au démarrage
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        if (currentUser && token) {
          // Si l'utilisateur est connecté, récupérer les favoris depuis l'API
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/favorites`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setFavorites(data);
          } else {
            // En cas d'erreur, utiliser les favoris stockés localement
            const storedFavorites = localStorage.getItem('favorites');
            if (storedFavorites) {
              setFavorites(JSON.parse(storedFavorites));
            }
          }
        } else {
          // Si l'utilisateur n'est pas connecté, utiliser les favoris stockés localement
          const storedFavorites = localStorage.getItem('favorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [currentUser, token]);

  // Sauvegarder les favoris dans le localStorage lorsqu'ils changent
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, loading]);

  // Sauvegarder les favoris dans l'API lorsque l'utilisateur est connecté
  const saveFavoritesToAPI = async (updatedFavorites) => {
    if (currentUser && token) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ favorites: updatedFavorites }),
        });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des favoris:', error);
      }
    }
  };

  // Ajouter un restaurant aux favoris
  const addFavorite = async (restaurant) => {
    const isAlreadyFavorite = favorites.some(fav => fav.id === restaurant.id);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, restaurant];
      setFavorites(updatedFavorites);
      await saveFavoritesToAPI(updatedFavorites);
    }
  };

  // Supprimer un restaurant des favoris
  const removeFavorite = async (restaurantId) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== restaurantId);
    setFavorites(updatedFavorites);
    await saveFavoritesToAPI(updatedFavorites);
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
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Créer le contexte pour le panier
const CartContext = createContext();

// Hook custom pour utiliser le contexte du panier
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  // Initialiser le panier depuis le localStorage au chargement
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurant = localStorage.getItem('restaurant');
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
        localStorage.removeItem('cart');
      }
    }
    
    if (savedRestaurant) {
      try {
        setRestaurant(JSON.parse(savedRestaurant));
      } catch (error) {
        console.error("Erreur lors du chargement du restaurant:", error);
        localStorage.removeItem('restaurant');
      }
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems]);

  // Sauvegarder le restaurant dans le localStorage à chaque modification
  useEffect(() => {
    if (restaurant) {
      localStorage.setItem('restaurant', JSON.stringify(restaurant));
    } else {
      localStorage.removeItem('restaurant');
    }
  }, [restaurant]);

  const addItem = (item, restaurantData) => {
    // Si le panier contient déjà des articles d'un autre restaurant
    if (restaurant && restaurantData && restaurant.id !== restaurantData.id && cartItems.length > 0) {
      if (!window.confirm(`Votre panier contient déjà des articles de ${restaurant.name}. Voulez-vous vider votre panier et ajouter cet article de ${restaurantData.name} ?`)) {
        return;
      }
      // Vider le panier si l'utilisateur confirme
      setCartItems([]);
    }
    
    // Mettre à jour le restaurant si nécessaire
    if (restaurantData && (!restaurant || restaurant.id !== restaurantData.id)) {
      setRestaurant(restaurantData);
    }
    
    // Vérifier si l'article existe déjà dans le panier
    const existingItemIndex = cartItems.findIndex(
      cartItem => cartItem.id === item.id && 
      JSON.stringify(cartItem.options) === JSON.stringify(item.options || {})
    );
    
    if (existingItemIndex !== -1) {
      // Si l'article existe, augmenter la quantité
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += item.quantity || 1;
      setCartItems(updatedCartItems);
    } else {
      // Sinon, ajouter le nouvel article
      setCartItems([...cartItems, { ...item, quantity: item.quantity || 1 }]);
    }
  };

  const updateItemQuantity = (itemId, quantity, options = {}) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId && JSON.stringify(item.options) === JSON.stringify(options)) {
        return { ...item, quantity };
      }
      return item;
    });
    
    setCartItems(updatedCartItems);
  };

  const removeItem = (itemId, options = {}) => {
    const updatedCartItems = cartItems.filter(
      item => !(item.id === itemId && JSON.stringify(item.options) === JSON.stringify(options))
    );
    
    setCartItems(updatedCartItems);
    
    // Si le panier est vide, réinitialiser le restaurant
    if (updatedCartItems.length === 0) {
      setRestaurant(null);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurant,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        getCartTotal,
        getCartItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default CartContext; 
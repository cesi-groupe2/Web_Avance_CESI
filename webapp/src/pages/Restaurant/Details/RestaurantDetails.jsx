import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiStar, FiClock, FiHeart, FiShoppingBag, FiPlus, FiMinus, FiChevronRight } from "react-icons/fi";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import { useAuth } from "../../../contexts/AuthContext";
import RestaurantApi from "../../../api/RestaurantApi";
import { useFavorites } from '../../../contexts/FavoritesContext';

// Instance de l'API Restaurant
const restaurantApi = new RestaurantApi();

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const RestaurantHeader = styled.div`
  position: relative;
  height: 300px;
  width: 100%;
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const RestaurantImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 30px;
  color: white;
`;

const RestaurantName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const RestaurantInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  
  & > div {
    display: flex;
    align-items: center;
    margin-right: 20px;
    
    svg {
      margin-right: 5px;
    }
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  svg {
    color: ${props => props.isFavorite ? '#FF5A5F' : '#666'};
    font-size: 20px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  
  @media (min-width: 992px) {
    flex-direction: row;
  }
`;

const MenuSection = styled.div`
  flex: 1;
  margin-right: 0;
  
  @media (min-width: 992px) {
    margin-right: 30px;
  }
`;

const CartSection = styled.div`
  width: 100%;
  margin-top: 30px;
  
  @media (min-width: 992px) {
    width: 350px;
    margin-top: 0;
  }
`;

const CategoryList = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 20px;
  padding-bottom: 10px;
  
  &::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
`;

const CategoryButton = styled.button`
  background-color: ${props => props.active ? '#00a082' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid ${props => props.active ? '#00a082' : '#e0e0e0'};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  margin-right: 10px;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#00a082' : '#f5f5f5'};
  }
`;

const MenuCategoryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 30px 0 15px;
  color: #333;
`;

const MenuItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MenuItem = styled.div`
  display: flex;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MenuItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const MenuItemContent = styled.div`
  flex-grow: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const MenuItemName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #333;
`;

const MenuItemDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 10px 0;
  flex-grow: 1;
`;

const MenuItemPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    font-weight: 600;
    color: #00a082;
  }
`;

const AddButton = styled.button`
  background-color: white;
  border: 1px solid #00a082;
  color: #00a082;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: #00a082;
    color: white;
  }
`;

const CartContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 100px;
`;

const CartTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #333;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    color: #00a082;
  }
`;

const CartEmpty = styled.p`
  text-align: center;
  color: #999;
  margin: 30px 0;
`;

const CartItems = styled.div`
  margin-bottom: 20px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemInfo = styled.div`
  flex-grow: 1;
`;

const CartItemName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const CartItemPrice = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const CartItemQuantity = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
  
  button {
    background-color: #f0f0f0;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #e0e0e0;
    }
  }
  
  span {
    margin: 0 10px;
    font-weight: 500;
  }
`;

const CartSummary = styled.div`
  margin-top: 20px;
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  div:first-child {
    color: #666;
  }
  
  div:last-child {
    font-weight: 500;
  }
  
  &.total {
    font-weight: 600;
    font-size: 1.1rem;
    margin-top: 15px;
    color: #333;
  }
`;

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  
  // Charger les détails du restaurant et les éléments du menu
  useEffect(() => {
    const fetchRestaurantDetails = () => {
      setLoading(true);
      
      // Récupérer les détails du restaurant
      restaurantApi.restaurantRestaurantIdGet(id, (error, data, response) => {
        if (error) {
          console.error('Erreur lors de la récupération des détails du restaurant:', error);
          setError('Erreur lors de la récupération des détails du restaurant');
          setLoading(false);
          return;
        }
        
        console.log('Détails du restaurant récupérés:', data);
        setRestaurant(data);
        
        // Récupérer les éléments du menu
        restaurantApi.restaurantRestaurantIdMenuitemsGet(id, (error, menuData, response) => {
          if (error) {
            console.error('Erreur lors de la récupération des éléments du menu:', error);
            setError('Erreur lors de la récupération des éléments du menu');
            setLoading(false);
            return;
          }
          
          console.log('Éléments du menu récupérés:', menuData);
          setMenuItems(menuData || []);
          setLoading(false);
        });
      });
    };
    
    fetchRestaurantDetails();
  }, [id]);
  
  // Extraire les catégories uniques du menu
  const menuCategories = menuItems.length > 0 
    ? ["Tous", ...new Set(menuItems.map(item => item.category || "Divers"))]
    : ["Tous"];
  
  // Filtrer les éléments du menu par catégorie
  const filteredMenuItems = activeCategory === "Tous" 
    ? menuItems 
    : menuItems.filter(item => (item.category || "Divers") === activeCategory);
  
  // Organiser les éléments du menu par catégorie pour l'affichage
  const menuByCategory = filteredMenuItems.reduce((acc, item) => {
    const category = item.category || "Divers";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
  
  // Ajouter un élément au panier
  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id_menu_item === item.id_menu_item);
    
    if (existingItemIndex !== -1) {
      // L'élément existe déjà dans le panier, augmenter la quantité
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Nouvel élément, l'ajouter au panier
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };
  
  // Augmenter la quantité d'un élément du panier
  const increaseQuantity = (itemId) => {
    const updatedCart = cart.map(item => 
      item.id_menu_item === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };
  
  // Diminuer la quantité d'un élément du panier
  const decreaseQuantity = (itemId) => {
    const updatedCart = cart.map(item => 
      item.id_menu_item === itemId && item.quantity > 1 
        ? { ...item, quantity: item.quantity - 1 } 
        : item
    ).filter(item => !(item.id_menu_item === itemId && item.quantity === 1));
    
    setCart(updatedCart);
  };
  
  // Calculer le sous-total du panier
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Frais de livraison fixes pour l'instant
  const deliveryFee = 2.99;
  
  // Calculer le total du panier
  const total = subtotal + deliveryFee;
  
  // Gérer le clic sur le bouton "Commander"
  const handleCheckout = () => {
    if (!currentUser) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      navigate("/login");
      return;
    }
    
    // Rediriger vers la page de paiement
    navigate("/checkout", { 
      state: { 
        cart, 
        restaurant, 
        subtotal,
        deliveryFee,
        total 
      }
    });
  };
  
  // Basculer le restaurant comme favori
  const toggleFavorite = () => {
    if (isFavorite(restaurant.id_restaurant)) {
      removeFavorite(restaurant.id_restaurant);
    } else {
      addFavorite(restaurant);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header />
        <ContentContainer>
          <div>Chargement des détails du restaurant...</div>
        </ContentContainer>
      </PageContainer>
    );
  }

  if (error || !restaurant) {
    return (
      <PageContainer>
        <Header />
        <ContentContainer>
          <div>Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.</div>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header />
      
      <RestaurantHeader>
        <RestaurantImage src={restaurant.picture || 'https://via.placeholder.com/1200x300?text=Restaurant'} alt={restaurant.name} />
        <HeaderOverlay>
          <RestaurantName>{restaurant.name}</RestaurantName>
          <RestaurantInfo>
            <div>
              <FiStar />
              <span>{restaurant.rating || "4.5"}</span>
            </div>
            <div>
              <FiClock />
              <span>{restaurant.opening_hours || "30-45 min"}</span>
            </div>
          </RestaurantInfo>
        </HeaderOverlay>
        <FavoriteButton 
          isFavorite={isFavorite(restaurant.id_restaurant)} 
          onClick={toggleFavorite}
          aria-label={isFavorite(restaurant.id_restaurant) ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <FiHeart fill={isFavorite(restaurant.id_restaurant) ? "#FF5A5F" : "none"} />
        </FavoriteButton>
      </RestaurantHeader>
      
      <ContentContainer>
        <MenuSection>
          <CategoryList>
            {menuCategories.map(category => (
              <CategoryButton 
                key={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </CategoryButton>
            ))}
          </CategoryList>
          
          {Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category}>
              <MenuCategoryTitle>{category}</MenuCategoryTitle>
              <MenuItems>
                {items.map(item => (
                  <MenuItem key={item.id_menu_item} onClick={() => addToCart(item)}>
                    <MenuItemImage src={item.image || 'https://via.placeholder.com/100x100?text=Menu'} alt={item.name} />
                    <MenuItemContent>
                      <MenuItemName>{item.name}</MenuItemName>
                      <MenuItemDescription>{item.description}</MenuItemDescription>
                      <MenuItemPrice>
                        <span>{item.price?.toFixed(2) || "0.00"} €</span>
                        <AddButton>
                          <FiPlus />
                          Ajouter
                        </AddButton>
                      </MenuItemPrice>
                    </MenuItemContent>
                  </MenuItem>
                ))}
              </MenuItems>
            </div>
          ))}
        </MenuSection>
        
        <CartSection>
          <CartContainer>
            <CartTitle>
              <FiShoppingBag />
              Votre commande
            </CartTitle>
            
            {cart.length === 0 ? (
              <CartEmpty>Votre panier est vide</CartEmpty>
            ) : (
              <>
                <CartItems>
                  {cart.map(item => (
                    <CartItem key={item.id_menu_item}>
                      <CartItemInfo>
                        <CartItemName>{item.name}</CartItemName>
                        <CartItemPrice>{item.price?.toFixed(2) || "0.00"} €</CartItemPrice>
                      </CartItemInfo>
                      <CartItemQuantity>
                        <button onClick={() => decreaseQuantity(item.id_menu_item)}>
                          <FiMinus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item.id_menu_item)}>
                          <FiPlus size={12} />
                        </button>
                      </CartItemQuantity>
                    </CartItem>
                  ))}
                </CartItems>
                
                <CartSummary>
                  <SummaryRow>
                    <div>Sous-total</div>
                    <div>{subtotal.toFixed(2)} €</div>
                  </SummaryRow>
                  <SummaryRow>
                    <div>Frais de livraison</div>
                    <div>{deliveryFee.toFixed(2)} €</div>
                  </SummaryRow>
                  <SummaryRow className="total">
                    <div>Total</div>
                    <div>{total.toFixed(2)} €</div>
                  </SummaryRow>
                </CartSummary>
                
                <Button 
                  fullWidth 
                  onClick={handleCheckout}
                  style={{ marginTop: '20px' }}
                >
                  Commander
                </Button>
              </>
            )}
          </CartContainer>
        </CartSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default RestaurantDetails; 
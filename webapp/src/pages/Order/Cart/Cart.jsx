import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../../../components/Header';
import Button from '../../../components/Button/Button';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const CartTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const EmptyCartText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #666;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const CartItems = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const CartItem = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 1.5rem 0;
  
  &:first-child {
    padding-top: 0;
  }
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ItemOptions = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const ItemQuantity = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background-color: transparent;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const QuantityText = styled.span`
  margin: 0 0.7rem;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #f44336;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  padding: 0;
  
  svg {
    margin-right: 0.3rem;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const CartSummary = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SummaryTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SummaryLabel = styled.span`
  color: #666;
`;

const SummaryValue = styled.span`
  font-weight: 500;
`;

const TotalRow = styled(SummaryRow)`
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const CheckoutButton = styled(Button)`
  margin-top: 1.5rem;
  width: 100%;
  background-color: #00a082;
  
  &:hover {
    background-color: #008a70;
  }
`;

const RestaurantInfo = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const RestaurantName = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const RestaurantAddress = styled.p`
  color: #666;
`;

const Cart = () => {
  const { cartItems, restaurant, updateItemQuantity, removeItem, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    updateItemQuantity(itemId, quantity);
  };
  
  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/order/checkout');
    } else {
      navigate('/login', { state: { from: '/order/checkout' } });
    }
  };
  
  const cartTotal = getCartTotal();
  const deliveryFee = 2.99;
  const serviceFee = 1.99;
  const total = cartTotal + deliveryFee + serviceFee;
  
  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <CartContainer>
          <CartTitle>Mon Panier</CartTitle>
          <EmptyCartMessage>
            <EmptyCartText>Panier troué (à implémenter)</EmptyCartText>
            <Button as={Link} to="/restaurants">
              Parcourir les restaurants
            </Button>
          </EmptyCartMessage>
        </CartContainer>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <CartContainer>
        <CartTitle>Mon Panier</CartTitle>
        
        {restaurant && (
          <RestaurantInfo>
            <RestaurantName>{restaurant.name}</RestaurantName>
            <RestaurantAddress>{restaurant.address}</RestaurantAddress>
          </RestaurantInfo>
        )}
        
        <CartContent>
          <CartItems>
            {cartItems.map((item) => (
              <CartItem key={item.id}>
                <ItemImage src={item.image || 'https://via.placeholder.com/80'} alt={item.name} />
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>{(item.price * item.quantity).toFixed(2)} €</ItemPrice>
                  
                  {item.options && Object.keys(item.options).length > 0 && (
                    <ItemOptions>
                      {Object.entries(item.options).map(([key, value]) => (
                        <div key={key}>
                          {key}: {value}
                        </div>
                      ))}
                    </ItemOptions>
                  )}
                  
                  <ItemQuantity>
                    <QuantityButton 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <FiMinus size={16} />
                    </QuantityButton>
                    <QuantityText>{item.quantity}</QuantityText>
                    <QuantityButton 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <FiPlus size={16} />
                    </QuantityButton>
                  </ItemQuantity>
                  
                  <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                    <FiTrash2 size={16} /> Supprimer
                  </RemoveButton>
                </ItemDetails>
              </CartItem>
            ))}
          </CartItems>
          
          <CartSummary>
            <SummaryTitle>Récapitulatif</SummaryTitle>
            <SummaryRow>
              <SummaryLabel>Sous-total</SummaryLabel>
              <SummaryValue>{cartTotal.toFixed(2)} €</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Frais de livraison</SummaryLabel>
              <SummaryValue>{deliveryFee.toFixed(2)} €</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Frais de service</SummaryLabel>
              <SummaryValue>{serviceFee.toFixed(2)} €</SummaryValue>
            </SummaryRow>
            <TotalRow>
              <SummaryLabel>Total</SummaryLabel>
              <SummaryValue>{total.toFixed(2)} €</SummaryValue>
            </TotalRow>
            
            <CheckoutButton onClick={handleCheckout}>
              Passer au paiement
            </CheckoutButton>
          </CartSummary>
        </CartContent>
      </CartContainer>
    </>
  );
};

export default Cart; 
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiCreditCard, FiMapPin, FiClock, FiInfo, FiCheckCircle } from "react-icons/fi";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 992px) {
    flex-direction: row;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  width: 100%;
  
  @media (min-width: 992px) {
    text-align: left;
  }
`;

const CheckoutSection = styled.div`
  flex: 1;
  margin-right: 0;
  
  @media (min-width: 992px) {
    margin-right: 30px;
  }
`;

const OrderSummarySection = styled.div`
  width: 100%;
  margin-top: 30px;
  
  @media (min-width: 992px) {
    width: 350px;
    margin-top: 0;
  }
`;

const FormCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

const FormCardTitle = styled.h2`
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

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const DeliveryOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DeliveryOption = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid ${props => props.selected ? '#00a082' : '#e0e0e0'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #00a082;
    background-color: ${props => props.selected ? '#f0f9f7' : 'transparent'};
  }
  
  background-color: ${props => props.selected ? '#f0f9f7' : 'transparent'};
`;

const RadioCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? '#00a082' : '#999'};
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.selected ? '#00a082' : 'transparent'};
  }
`;

const DeliveryOptionInfo = styled.div`
  flex-grow: 1;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 5px 0;
  }
  
  p {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
  }
`;

const DeliveryPrice = styled.div`
  font-weight: 600;
  color: ${props => props.free ? '#00a082' : '#333'};
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid ${props => props.selected ? '#00a082' : '#e0e0e0'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #00a082;
    background-color: ${props => props.selected ? '#f0f9f7' : 'transparent'};
  }
  
  background-color: ${props => props.selected ? '#f0f9f7' : 'transparent'};
`;

const PaymentMethodInfo = styled.div`
  flex-grow: 1;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }
`;

const CardForm = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const OrderSummaryCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 100px;
`;

const OrderInfo = styled.div`
  margin-bottom: 20px;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 15px 0;
    color: #333;
  }
`;

const RestaurantInfo = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

const RestaurantImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
`;

const RestaurantName = styled.div`
  font-weight: 500;
`;

const DeliveryTimeInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  color: #666;
  
  svg {
    margin-right: 10px;
    color: #00a082;
  }
`;

const OrderItems = styled.div`
  margin-bottom: 20px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  div:first-child {
    display: flex;
  }
  
  span:first-child {
    color: #666;
    margin-right: 8px;
  }
  
  span:last-child {
    font-weight: 500;
  }
`;

const OrderTotal = styled.div`
  border-top: 1px solid #e0e0e0;
  padding-top: 15px;
  margin-top: 15px;
`;

const TotalRow = styled.div`
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

const SuccessMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  
  svg {
    color: #00a082;
    font-size: 3rem;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 30px;
  }
`;

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartSection = styled(Section)`
  grid-column: 1;
`;

const OrderSummary = styled(Section)`
  grid-column: 2;
  grid-row: span 2;
  align-self: start;
  position: sticky;
  top: 2rem;
  
  @media (max-width: 768px) {
    grid-column: 1;
    position: static;
  }
`;

const CartItem = styled.div`
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-right: 1rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const ItemOptions = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  text-align: right;
  min-width: 80px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Quantity = styled.span`
  margin: 0 10px;
  font-size: 0.875rem;
`;

const CartEmpty = styled.div`
  padding: 2rem;
  text-align: center;
  color: #666;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
  
  &:last-of-type {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f0f0f0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #333;
  }
`;

const DeliverySection = styled(Section)`
  grid-column: 1;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  font-size: 1rem;
  background-color: #4caf50;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ContinueButton = styled(Button)`
  margin-top: 1rem;
  background-color: #2196f3;
  
  &:hover {
    background-color: #0b7dda;
  }
`;

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cartItems, updateItemQuantity, removeItem, clearCart, getCartTotal, restaurant } = useCart();
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    additionalInfo: ""
  });
  
  // Populate delivery info from user profile if available
  useEffect(() => {
    if (currentUser) {
      setDeliveryInfo({
        address: currentUser.Address || "",
        city: currentUser.City || "",
        postalCode: currentUser.PostalCode || "",
        phone: currentUser.Phone || "",
        additionalInfo: currentUser.AdditionalInfo || ""
      });
    }
  }, [currentUser]);
  
  const subtotal = getCartTotal();
  const deliveryFee = restaurant ? restaurant.deliveryFee || 2.99 : 2.99;
  const total = subtotal + deliveryFee;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateItemQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };
  
  const handleIncrease = (item) => {
    updateItemQuantity(item.id, item.quantity + 1);
  };
  
  const handleContinue = () => {
    setShowDeliveryForm(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create order data
    const orderData = {
      restaurantId: restaurant?.id,
      items: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        options: item.options
      })),
      deliveryInfo: {
        ...deliveryInfo,
        firstName: currentUser?.FirstName || "",
        lastName: currentUser?.LastName || ""
      },
      total
    };
    
    console.log("Commande soumise:", orderData);
    
    // TODO: Send order to API
    
    // Clear cart and redirect to tracking
    clearCart();
    navigate("/order/tracking");
  };
  
  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <CheckoutContainer>
          <Section>
            <SectionTitle>Votre panier</SectionTitle>
            <CartEmpty>
              <p>Votre panier est vide</p>
              <ContinueButton onClick={() => navigate("/restaurants")}>
                Parcourir les restaurants
              </ContinueButton>
            </CartEmpty>
          </Section>
        </CheckoutContainer>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <CheckoutContainer>
        <CheckoutGrid>
          <CartSection>
            <SectionTitle>
              Votre panier
              {restaurant && <span>de {restaurant.name}</span>}
            </SectionTitle>
            
            {cartItems.map(item => (
              <CartItem key={item.id}>
                <ItemImage>
                  {item.image && <img src={item.image} alt={item.name} />}
                </ItemImage>
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  {item.options && Object.entries(item.options).length > 0 && (
                    <ItemOptions>
                      {Object.entries(item.options).map(([key, value]) => (
                        `${key}: ${value}`
                      )).join(", ")}
                    </ItemOptions>
                  )}
                  <QuantityControl>
                    <QuantityButton onClick={() => handleDecrease(item)}>-</QuantityButton>
                    <Quantity>{item.quantity}</Quantity>
                    <QuantityButton onClick={() => handleIncrease(item)}>+</QuantityButton>
                  </QuantityControl>
                </ItemDetails>
                <ItemPrice>{(item.price * item.quantity).toFixed(2)} €</ItemPrice>
              </CartItem>
            ))}
            
            {!showDeliveryForm && (
              <ContinueButton onClick={handleContinue}>
                Continuer
              </ContinueButton>
            )}
          </CartSection>
          
          {showDeliveryForm && (
            <DeliverySection>
              <SectionTitle>Informations de livraison</SectionTitle>
              <form onSubmit={handleSubmit}>
                <FormGrid>
                  <FullWidth>
                    <Input
                      label="Adresse de livraison"
                      name="address"
                      value={deliveryInfo.address}
                      onChange={handleInputChange}
                      required
                    />
                  </FullWidth>
                  <Input
                    label="Ville"
                    name="city"
                    value={deliveryInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Code postal"
                    name="postalCode"
                    value={deliveryInfo.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Téléphone"
                    name="phone"
                    value={deliveryInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <FullWidth>
                    <Input
                      label="Instructions supplémentaires"
                      name="additionalInfo"
                      value={deliveryInfo.additionalInfo}
                      onChange={handleInputChange}
                      placeholder="Étage, code d'entrée, etc."
                    />
                  </FullWidth>
                </FormGrid>
              </form>
            </DeliverySection>
          )}
          
          <OrderSummary>
            <SectionTitle>Récapitulatif</SectionTitle>
            <PriceRow>
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </PriceRow>
            <PriceRow>
              <span>Frais de livraison</span>
              <span>{deliveryFee.toFixed(2)} €</span>
            </PriceRow>
            <PriceRow>
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </PriceRow>
            
            {showDeliveryForm && (
              <CheckoutButton onClick={handleSubmit} disabled={!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.postalCode || !deliveryInfo.phone}>
                Passer la commande
              </CheckoutButton>
            )}
          </OrderSummary>
        </CheckoutGrid>
      </CheckoutContainer>
    </>
  );
};

export default Checkout; 
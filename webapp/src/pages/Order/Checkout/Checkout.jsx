import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiCreditCard, FiMapPin, FiClock, FiInfo, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import Header from "../../../components/Header";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";
import OrderApi from "../../../api/OrderApi";

const orderApi = new OrderApi();

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
  align-items: center;
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemQuantity = styled.div`
  font-weight: 600;
  margin-right: 10px;
  color: #333;
  min-width: 20px;
  text-align: center;
`;

const ItemInfo = styled.div`
  flex-grow: 1;
  
  p {
    margin: 0;
    font-size: 0.95rem;
  }
  
  .item-name {
    font-weight: 500;
  }
  
  .item-options {
    font-size: 0.8rem;
    color: #666;
  }
`;

const ItemPrice = styled.div`
  font-weight: 600;
  margin-left: 10px;
`;

const OrderTotals = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.95rem;
  
  &:last-child {
    margin-bottom: 0;
    margin-top: 15px;
    font-weight: 600;
    font-size: 1.1rem;
  }
`;

const PlaceOrderButton = styled(Button)`
  width: 100%;
  margin-top: 20px;
`;

const MessageBanner = styled.div`
  padding: 15px;
  background-color: ${props => props.type === 'success' ? '#e7f7ef' : '#fff3cd'};
  color: ${props => props.type === 'success' ? '#0f5132' : '#856404'};
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid ${props => props.type === 'success' ? '#d1e7dd' : '#ffe69c'};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    min-width: 20px;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  p {
    margin-bottom: 20px;
    color: #666;
  }
`;

const Checkout = () => {
  const { isAuthenticated, currentUser, token } = useAuth();
  const { cartItems, restaurant, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.FirstName || "",
    lastName: currentUser?.LastName || "",
    email: currentUser?.Email || "",
    phone: currentUser?.Phone || "",
    address: currentUser?.DeliveryAdress || "",
    city: "",
    postalCode: "",
    additionalInfo: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: ""
  });
  
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const subtotal = getCartTotal();
  const deliveryFee = deliveryOption === "express" ? 4.99 : 2.99;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;
  
  // Remplir les champs du formulaire avec les données utilisateur au chargement
  useEffect(() => {
    if (currentUser) {
      setFormData(prevData => ({
        ...prevData,
        firstName: currentUser.FirstName || currentUser.first_name || "",
        lastName: currentUser.LastName || currentUser.last_name || "",
        email: currentUser.Email || currentUser.email || "",
        phone: currentUser.Phone || currentUser.phone || "",
        address: currentUser.DeliveryAdress || currentUser.delivery_adress || ""
      }));
    }
  }, [currentUser]);
  
  // Rediriger si le panier est vide
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    const requiredFields = [
      "firstName", "lastName", "email", "phone", "address", "city", "postalCode"
    ];
    
    if (paymentMethod === "card") {
      requiredFields.push("cardNumber", "cardName", "cardExpiry", "cardCvc");
    }
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        setMessage({
          type: "error",
          text: `Veuillez remplir tous les champs obligatoires.`
        });
        return false;
      }
    }
    
    // Validation simple de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({
        type: "error",
        text: "Veuillez entrer une adresse email valide."
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Préparer les données de commande
      const orderItems = cartItems.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        options: item.options || {},
        name: item.name
      }));
      
      const orderData = {
        user_id: currentUser?.id_user || "guest",
        restaurant_id: restaurant?.id,
        restaurant_name: restaurant?.name,
        delivery_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        delivery_method: deliveryOption,
        payment_method: paymentMethod,
        status: "pending",
        total_price: total,
        items: orderItems,
        delivery_fee: deliveryFee,
        discount: discount,
        contact_info: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        },
        additional_info: formData.additionalInfo || ""
      };
      
      // Appel à l'API pour créer la commande
      orderApi.rootPost(orderData, (error, data, response) => {
        setIsLoading(false);
        
        if (error) {
          console.error("Erreur lors de la création de la commande:", error);
          setMessage({
            type: "error",
            text: "Une erreur est survenue lors de la création de votre commande. Veuillez réessayer."
          });
          return;
        }
        
        // Succès
        setMessage({
          type: "success",
          text: "Votre commande a été créée avec succès !"
        });
        
        // Vider le panier
        clearCart();
        
        // Rediriger vers la page de confirmation
        setTimeout(() => {
          navigate(`/order/tracking/${data.id}`);
        }, 2000);
      });
    } catch (error) {
      console.error("Erreur lors de la soumission de la commande:", error);
      setIsLoading(false);
      setMessage({
        type: "error",
        text: "Une erreur est survenue lors de la création de votre commande. Veuillez réessayer."
      });
    }
  };
  
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <Header />
        <ContentContainer>
          <LoginPrompt>
            <h2>Connectez-vous pour passer commande</h2>
            <p>Vous devez être connecté pour finaliser votre commande.</p>
            <Button onClick={() => navigate("/login", { state: { from: "/order/checkout" } })}>
              Se connecter
            </Button>
          </LoginPrompt>
        </ContentContainer>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <CheckoutSection>
          <Title>Finaliser votre commande</Title>
          
          {message && (
            <MessageBanner type={message.type}>
              {message.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
              {message.text}
            </MessageBanner>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormCard>
              <FormCardTitle>
                <FiMapPin />
                Informations de livraison
              </FormCardTitle>
              
              <FormRow>
                <Input
                  label="Prénom *"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Votre prénom"
                  required
                />
                <Input
                  label="Nom *"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  required
                />
              </FormRow>
              
              <FormRow>
                <Input
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Votre email"
                  required
                />
                <Input
                  label="Téléphone *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Votre numéro de téléphone"
                  required
                />
              </FormRow>
              
              <Input
                label="Adresse *"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Votre adresse de livraison"
                required
              />
              
              <FormRow>
                <Input
                  label="Ville *"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Votre ville"
                  required
                />
                <Input
                  label="Code postal *"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Votre code postal"
                  required
                />
              </FormRow>
              
              <Input
                label="Instructions complémentaires"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Informations supplémentaires pour la livraison"
                textarea
              />
              
              <FormCardTitle style={{ marginTop: "30px" }}>
                <FiClock />
                Options de livraison
              </FormCardTitle>
              
              <DeliveryOptions>
                <DeliveryOption 
                  selected={deliveryOption === "standard"} 
                  onClick={() => setDeliveryOption("standard")}
                >
                  <RadioCircle selected={deliveryOption === "standard"} />
                  <DeliveryOptionInfo>
                    <h3>Livraison standard</h3>
                    <p>Livraison en 30-45 minutes</p>
                  </DeliveryOptionInfo>
                  <DeliveryPrice>2.99 €</DeliveryPrice>
                </DeliveryOption>
                
                <DeliveryOption 
                  selected={deliveryOption === "express"} 
                  onClick={() => setDeliveryOption("express")}
                >
                  <RadioCircle selected={deliveryOption === "express"} />
                  <DeliveryOptionInfo>
                    <h3>Livraison express</h3>
                    <p>Livraison en 20-30 minutes</p>
                  </DeliveryOptionInfo>
                  <DeliveryPrice>4.99 €</DeliveryPrice>
                </DeliveryOption>
              </DeliveryOptions>
            </FormCard>
            
            <FormCard>
              <FormCardTitle>
                <FiCreditCard />
                Méthode de paiement
              </FormCardTitle>
              
              <PaymentMethods>
                <PaymentMethod 
                  selected={paymentMethod === "card"} 
                  onClick={() => setPaymentMethod("card")}
                >
                  <RadioCircle selected={paymentMethod === "card"} />
                  <PaymentMethodInfo>
                    <h3>Carte bancaire</h3>
                  </PaymentMethodInfo>
                </PaymentMethod>
                
                <PaymentMethod 
                  selected={paymentMethod === "paypal"} 
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <RadioCircle selected={paymentMethod === "paypal"} />
                  <PaymentMethodInfo>
                    <h3>PayPal</h3>
                  </PaymentMethodInfo>
                </PaymentMethod>
                
                <PaymentMethod 
                  selected={paymentMethod === "cash"} 
                  onClick={() => setPaymentMethod("cash")}
                >
                  <RadioCircle selected={paymentMethod === "cash"} />
                  <PaymentMethodInfo>
                    <h3>Paiement à la livraison</h3>
                  </PaymentMethodInfo>
                </PaymentMethod>
              </PaymentMethods>
              
              {paymentMethod === "card" && (
                <CardForm visible="true">
                  <Input
                    label="Numéro de carte *"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  
                  <Input
                    label="Nom sur la carte *"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="NOM PRÉNOM"
                  />
                  
                  <FormRow>
                    <Input
                      label="Date d'expiration *"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/AA"
                      maxLength="5"
                    />
                    <Input
                      label="CVC *"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="3"
                    />
                  </FormRow>
                </CardForm>
              )}
            </FormCard>
            
            <Button
              type="submit"
              disabled={isLoading}
              style={{ display: "none" }}
            >
              {isLoading ? "Traitement en cours..." : "Passer la commande"}
            </Button>
          </form>
        </CheckoutSection>
        
        <OrderSummarySection>
          <OrderSummaryCard>
            <OrderInfo>
              <h3>Résumé de la commande</h3>
              
              {restaurant && (
                <RestaurantInfo>
                  <RestaurantImage src={restaurant.image || "https://via.placeholder.com/50"} alt={restaurant.name} />
                  <RestaurantName>{restaurant.name}</RestaurantName>
                </RestaurantInfo>
              )}
              
              <DeliveryTimeInfo>
                <FiClock />
                <span>Livraison estimée : {deliveryOption === "express" ? "20-30" : "30-45"} min</span>
              </DeliveryTimeInfo>
            </OrderInfo>
            
            <OrderItems>
              {cartItems.map((item, index) => (
                <OrderItem key={index}>
                  <ItemQuantity>{item.quantity}x</ItemQuantity>
                  <ItemInfo>
                    <p className="item-name">{item.name}</p>
                    {item.options && Object.keys(item.options).length > 0 && (
                      <p className="item-options">
                        {Object.entries(item.options).map(([key, value]) => `${key}: ${value}`).join(", ")}
                      </p>
                    )}
                  </ItemInfo>
                  <ItemPrice>{(item.price * item.quantity).toFixed(2)} €</ItemPrice>
                </OrderItem>
              ))}
            </OrderItems>
            
            <OrderTotals>
              <TotalRow>
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </TotalRow>
              <TotalRow>
                <span>Frais de livraison</span>
                <span>{deliveryFee.toFixed(2)} €</span>
              </TotalRow>
              {discount > 0 && (
                <TotalRow>
                  <span>Remise</span>
                  <span>-{discount.toFixed(2)} €</span>
                </TotalRow>
              )}
              <TotalRow>
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </TotalRow>
            </OrderTotals>
            
            <PlaceOrderButton
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Traitement en cours..." : "Passer la commande"}
            </PlaceOrderButton>
          </OrderSummaryCard>
        </OrderSummarySection>
      </ContentContainer>
    </PageContainer>
  );
};

export default Checkout; 
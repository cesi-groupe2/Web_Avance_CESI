import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiMapPin, FiClock, FiUser, FiPhone, FiBarChart2, FiPackage, FiTruck, FiHome, FiCheckCircle } from "react-icons/fi";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import { useAuth } from "../../../contexts/AuthContext";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const ContentContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const TrackingCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TopSection = styled.div`
  padding: 25px;
  
  @media (min-width: 768px) {
    display: flex;
    gap: 30px;
  }
`;

const OrderInfo = styled.div`
  flex: 1;
  margin-bottom: 25px;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const OrderNumber = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 5px 0;
`;

const RestaurantName = styled.h2`
  font-size: 1.3rem;
  margin: 0 0 15px 0;
`;

const DeliveryInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  gap: 10px;
  
  svg {
    color: #00a082;
    min-width: 20px;
  }
  
  p {
    margin: 0;
    font-size: 0.95rem;
    color: #333;
  }
  
  span {
    display: block;
    color: #666;
    font-size: 0.85rem;
    margin-top: 2px;
  }
`;

const MapSection = styled.div`
  flex: 1;
  background-color: #eee;
  border-radius: 8px;
  height: 200px;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    min-height: auto;
  }
`;

const MapPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  font-size: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DriverInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 25px;
  background-color: #f0f9f7;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
`;

const DriverAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #00a082;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
`;

const DriverDetails = styled.div`
  flex: 1;
  
  h3 {
    font-size: 1rem;
    margin: 0 0 5px 0;
  }
  
  p {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
  }
`;

const CallButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #00a082;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  
  &:hover {
    background-color: #008868;
  }
`;

const TrackingTimeline = styled.div`
  padding: 25px;
`;

const TimelineTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 20px 0;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimelineItem = styled.div`
  display: flex;
  padding-bottom: 30px;
  position: relative;
  
  &:last-child {
    padding-bottom: 0;
  }
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 32px;
    left: 12px;
    width: 2px;
    height: calc(100% - 32px);
    background-color: ${props => props.completed ? '#00a082' : '#e0e0e0'};
  }
`;

const TimelineIcon = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  z-index: 1;
  
  background-color: ${props => props.completed ? '#00a082' : props.active ? '#fff' : '#f0f0f0'};
  color: ${props => props.completed ? '#fff' : props.active ? '#00a082' : '#999'};
  border: ${props => props.active ? '2px solid #00a082' : 'none'};
  
  svg {
    font-size: 14px;
  }
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineEventTitle = styled.h4`
  font-size: 1rem;
  margin: 0 0 5px 0;
  color: ${props => props.active ? '#00a082' : props.completed ? '#333' : '#999'};
`;

const TimelineEventTime = styled.p`
  font-size: 0.85rem;
  color: ${props => props.active || props.completed ? '#666' : '#999'};
  margin: 0;
`;

const OrderItemsSection = styled.div`
  padding: 25px;
  border-top: 1px solid #e0e0e0;
`;

const OrderItemsTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 20px 0;
`;

const OrderItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  
  div:first-child {
    display: flex;
  }
  
  span:first-child {
    color: #666;
    margin-right: 8px;
  }
`;

const Tracking = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // État pour stocker les données de la commande
  const [orderData, setOrderData] = useState(null);
  // État pour le statut de livraison
  const [deliveryStatus, setDeliveryStatus] = useState('preparing');
  // État pour suivre le temps écoulé depuis la commande
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    // Simulation de récupération des données de commande depuis l'API
    // Dans une application réelle, vous feriez un appel API ici
    const mockOrderData = {
      orderNumber: `#${orderNumber}`,
      restaurant: {
        name: "Le Gourmet Français",
        address: "123 rue de la Gastronomie, Paris"
      },
      orderTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      estimatedDelivery: 35, // minutes
      deliveryAddress: "156 boulevard Haussmann, Paris",
      items: [
        { id: 1, name: "Burger Gourmet", quantity: 2, price: 12.99 },
        { id: 2, name: "Frites Maison", quantity: 1, price: 3.99 },
        { id: 3, name: "Coca Cola", quantity: 2, price: 2.50 }
      ],
      driver: {
        name: "Thomas M.",
        phone: "+33612345678",
        rating: 4.8
      },
      total: 34.97,
      status: "preparing" // enum: preparing, onTheWay, nearYou, delivered
    };
    
    setOrderData(mockOrderData);
    setDeliveryStatus(mockOrderData.status);
    
    // Simuler les changements d'état de la livraison
    const prepTime = 3; // en secondes pour la démo (normalement en minutes)
    const deliveryTime = 6; // en secondes pour la démo
    const nearbyTime = 9; // en secondes pour la démo
    
    setTimeout(() => {
      setDeliveryStatus('onTheWay');
    }, prepTime * 1000);
    
    setTimeout(() => {
      setDeliveryStatus('nearYou');
    }, nearbyTime * 1000);
    
    setTimeout(() => {
      setDeliveryStatus('delivered');
    }, (nearbyTime + deliveryTime) * 1000);
    
    // Mise à jour du temps écoulé
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 60 * 1000); // tous les minutes
    
    return () => clearInterval(timer);
  }, [orderNumber]);
  
  if (!orderData) {
    return (
      <PageContainer>
        <Header isAuthenticated={!!currentUser} userRole={currentUser?.role} />
        <ContentContainer>
          <Title>Chargement des informations de livraison...</Title>
        </ContentContainer>
      </PageContainer>
    );
  }
  
  // Calculer le temps écoulé depuis la commande
  const orderTime = new Date(orderData.orderTime);
  const minutesElapsed = Math.floor((Date.now() - orderTime.getTime()) / (1000 * 60));
  
  // Formater l'heure pour l'affichage
  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Calculer l'heure estimée de livraison
  const estimatedDeliveryTime = new Date(orderTime.getTime() + orderData.estimatedDelivery * 60 * 1000);
  
  // Déterminer le statut de chaque étape
  const timelineStatuses = {
    ordered: { completed: true, active: false },
    preparing: { 
      completed: deliveryStatus !== 'ordered', 
      active: deliveryStatus === 'preparing' 
    },
    onTheWay: { 
      completed: ['nearYou', 'delivered'].includes(deliveryStatus), 
      active: deliveryStatus === 'onTheWay' 
    },
    nearYou: { 
      completed: deliveryStatus === 'delivered', 
      active: deliveryStatus === 'nearYou' 
    },
    delivered: { 
      completed: false, 
      active: deliveryStatus === 'delivered' 
    }
  };
  
  // Générer les temps pour chaque étape (dans une application réelle, ces données viendraient du backend)
  const timelineData = {
    ordered: {
      title: "Commande reçue",
      time: formatTime(orderTime)
    },
    preparing: {
      title: "Préparation en cours",
      time: formatTime(new Date(orderTime.getTime() + 5 * 60 * 1000))
    },
    onTheWay: {
      title: "En cours de livraison",
      time: formatTime(new Date(orderTime.getTime() + 15 * 60 * 1000))
    },
    nearYou: {
      title: "Presque arrivé",
      time: formatTime(new Date(orderTime.getTime() + 30 * 60 * 1000))
    },
    delivered: {
      title: "Livré",
      time: formatTime(estimatedDeliveryTime)
    }
  };
  
  // Calculer le total de la commande
  const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <PageContainer>
      <Header isAuthenticated={!!currentUser} userRole={currentUser?.role} />
      
      <ContentContainer>
        <Title>Suivi de commande {orderData.orderNumber}</Title>
        
        <TrackingCard>
          <TopSection>
            <OrderInfo>
              <OrderNumber>Commande {orderData.orderNumber}</OrderNumber>
              <RestaurantName>{orderData.restaurant.name}</RestaurantName>
              
              <DeliveryInfoGrid>
                <InfoItem>
                  <FiMapPin />
                  <div>
                    <p>Restaurant</p>
                    <span>{orderData.restaurant.address}</span>
                  </div>
                </InfoItem>
                
                <InfoItem>
                  <FiClock />
                  <div>
                    <p>Heure de commande</p>
                    <span>{formatTime(orderTime)}</span>
                  </div>
                </InfoItem>
                
                <InfoItem>
                  <FiMapPin />
                  <div>
                    <p>Adresse de livraison</p>
                    <span>{orderData.deliveryAddress}</span>
                  </div>
                </InfoItem>
                
                <InfoItem>
                  <FiClock />
                  <div>
                    <p>Livraison estimée</p>
                    <span>{formatTime(estimatedDeliveryTime)}</span>
                  </div>
                </InfoItem>
              </DeliveryInfoGrid>
              
              {['delivered', 'nearYou', 'onTheWay'].includes(deliveryStatus) ? (
                <Button onClick={() => {}} variant="outlined">Contacter le support</Button>
              ) : (
                <Button onClick={() => {}} variant="outlined">Annuler ma commande</Button>
              )}
            </OrderInfo>
            
            <MapSection>
              <MapPlaceholder>
                <img 
                  src="https://maps.googleapis.com/maps/api/staticmap?center=Paris,France&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7CChamps-Elysees,Paris&key=YOUR_API_KEY" 
                  alt="Carte de livraison" 
                />
              </MapPlaceholder>
            </MapSection>
          </TopSection>
          
          {['delivered', 'nearYou', 'onTheWay'].includes(deliveryStatus) && (
            <DriverInfo>
              <DriverAvatar>
                <FiUser />
              </DriverAvatar>
              
              <DriverDetails>
                <h3>{orderData.driver.name}</h3>
                <p>⭐ {orderData.driver.rating} • Votre livreur</p>
              </DriverDetails>
              
              <CallButton href={`tel:${orderData.driver.phone}`}>
                <FiPhone />
              </CallButton>
            </DriverInfo>
          )}
          
          <TrackingTimeline>
            <TimelineTitle>Suivi de livraison</TimelineTitle>
            
            <Timeline>
              <TimelineItem completed={timelineStatuses.ordered.completed}>
                <TimelineIcon completed={timelineStatuses.ordered.completed} active={timelineStatuses.ordered.active}>
                  <FiBarChart2 />
                </TimelineIcon>
                <TimelineContent>
                  <TimelineEventTitle completed={timelineStatuses.ordered.completed} active={timelineStatuses.ordered.active}>
                    {timelineData.ordered.title}
                  </TimelineEventTitle>
                  <TimelineEventTime completed={timelineStatuses.ordered.completed} active={timelineStatuses.ordered.active}>
                    {timelineData.ordered.time}
                  </TimelineEventTime>
                </TimelineContent>
              </TimelineItem>
              
              <TimelineItem completed={timelineStatuses.preparing.completed}>
                <TimelineIcon completed={timelineStatuses.preparing.completed} active={timelineStatuses.preparing.active}>
                  <FiPackage />
                </TimelineIcon>
                <TimelineContent>
                  <TimelineEventTitle completed={timelineStatuses.preparing.completed} active={timelineStatuses.preparing.active}>
                    {timelineData.preparing.title}
                  </TimelineEventTitle>
                  <TimelineEventTime completed={timelineStatuses.preparing.completed} active={timelineStatuses.preparing.active}>
                    {timelineData.preparing.time}
                  </TimelineEventTime>
                </TimelineContent>
              </TimelineItem>
              
              <TimelineItem completed={timelineStatuses.onTheWay.completed}>
                <TimelineIcon completed={timelineStatuses.onTheWay.completed} active={timelineStatuses.onTheWay.active}>
                  <FiTruck />
                </TimelineIcon>
                <TimelineContent>
                  <TimelineEventTitle completed={timelineStatuses.onTheWay.completed} active={timelineStatuses.onTheWay.active}>
                    {timelineData.onTheWay.title}
                  </TimelineEventTitle>
                  <TimelineEventTime completed={timelineStatuses.onTheWay.completed} active={timelineStatuses.onTheWay.active}>
                    {timelineData.onTheWay.time}
                  </TimelineEventTime>
                </TimelineContent>
              </TimelineItem>
              
              <TimelineItem completed={timelineStatuses.nearYou.completed}>
                <TimelineIcon completed={timelineStatuses.nearYou.completed} active={timelineStatuses.nearYou.active}>
                  <FiMapPin />
                </TimelineIcon>
                <TimelineContent>
                  <TimelineEventTitle completed={timelineStatuses.nearYou.completed} active={timelineStatuses.nearYou.active}>
                    {timelineData.nearYou.title}
                  </TimelineEventTitle>
                  <TimelineEventTime completed={timelineStatuses.nearYou.completed} active={timelineStatuses.nearYou.active}>
                    {timelineData.nearYou.time}
                  </TimelineEventTime>
                </TimelineContent>
              </TimelineItem>
              
              <TimelineItem completed={timelineStatuses.delivered.completed}>
                <TimelineIcon completed={timelineStatuses.delivered.completed} active={timelineStatuses.delivered.active}>
                  <FiHome />
                </TimelineIcon>
                <TimelineContent>
                  <TimelineEventTitle completed={timelineStatuses.delivered.completed} active={timelineStatuses.delivered.active}>
                    {timelineData.delivered.title}
                  </TimelineEventTitle>
                  <TimelineEventTime completed={timelineStatuses.delivered.completed} active={timelineStatuses.delivered.active}>
                    {timelineData.delivered.time}
                  </TimelineEventTime>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </TrackingTimeline>
          
          <OrderItemsSection>
            <OrderItemsTitle>Détails de la commande</OrderItemsTitle>
            
            <OrderItemsList>
              {orderData.items.map(item => (
                <OrderItem key={item.id}>
                  <div>
                    <span>{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </OrderItem>
              ))}
            </OrderItemsList>
            
            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
            
            <OrderItemsList>
              <OrderItem>
                <div>
                  <span>Sous-total</span>
                </div>
                <span>{subtotal.toFixed(2)} €</span>
              </OrderItem>
              <OrderItem>
                <div>
                  <span>Frais de livraison</span>
                </div>
                <span>{(orderData.total - subtotal).toFixed(2)} €</span>
              </OrderItem>
              <OrderItem style={{ fontWeight: 'bold', marginTop: '10px' }}>
                <div>
                  <span>Total</span>
                </div>
                <span>{orderData.total.toFixed(2)} €</span>
              </OrderItem>
            </OrderItemsList>
          </OrderItemsSection>
        </TrackingCard>
      </ContentContainer>
    </PageContainer>
  );
};

export default Tracking; 
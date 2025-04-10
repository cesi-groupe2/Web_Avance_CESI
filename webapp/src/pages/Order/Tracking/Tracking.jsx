import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiClock, FiMapPin, FiUser, FiShoppingBag, FiPhone, FiMail, FiTruck, FiCheckSquare } from "react-icons/fi";
import Header from "../../../components/Header";
import Button from "../../../components/Button/Button";
import { useAuth } from "../../../contexts/AuthContext";
import OrderApi from "../../../api/OrderApi";

const orderApi = new OrderApi();

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
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const TrackingCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

const StatusHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const OrderNumber = styled.div`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 10px;
`;

const StatusTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
`;

const DeliveryTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00a082;
  font-size: 1.1rem;
  font-weight: 500;
  
  svg {
    margin-right: 10px;
  }
`;

const ProgressTracker = styled.div`
  margin: 40px 0;
`;

const Steps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 25px;
    left: 0;
    right: 0;
    height: 4px;
    background-color: #e0e0e0;
    z-index: 1;
  }
`;

const StepIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#00a082' : props.completed ? '#00a082' : '#e0e0e0'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  
  svg {
    font-size: 1.5rem;
  }
`;

const StepLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const StepLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.active ? '#00a082' : props.completed ? '#00a082' : '#666'};
  font-weight: ${props => props.active || props.completed ? '600' : '400'};
  width: 90px;
  text-align: center;
  transition: all 0.3s ease;
`;

const OrderDetailsSection = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const OrderDetailsCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    color: #00a082;
  }
`;

const InfoRow = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #333;
`;

const OrderItems = styled.div`
  margin-top: 15px;
`;

const OrderItem = styled.div`
  display: flex;
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemQuantity = styled.div`
  font-weight: 600;
  margin-right: 10px;
  min-width: 25px;
`;

const ItemDetails = styled.div`
  flex-grow: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const ItemOptions = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  margin-left: 15px;
  min-width: 60px;
  text-align: right;
`;

const OrderSummary = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    margin-top: 15px;
    font-weight: 600;
    font-size: 1.1rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
  
  button {
    flex: 1;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #666;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #e74c3c;
`;

const Tracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const statusLabels = {
    'pending': 'Commande reçue',
    'confirmed': 'Commande confirmée',
    'preparing': 'En préparation',
    'ready': 'Prêt pour livraison',
    'delivering': 'En cours de livraison',
    'delivered': 'Livré',
    'cancelled': 'Annulé'
  };
  
  const statusIndex = {
    'pending': 0,
    'confirmed': 1,
    'preparing': 2,
    'ready': 2,
    'delivering': 3,
    'delivered': 4,
    'cancelled': -1
  };
  
  const getStatusIndex = (status) => {
    return statusIndex[status] || 0;
  };
  
  // Charger les détails de la commande
  useEffect(() => {
    if (!orderId) return;
    
    setLoading(true);
    setError(null);
    
    orderApi.orderIdGet(orderId, (error, data, response) => {
      setLoading(false);
      
      if (error) {
        console.error("Erreur lors de la récupération de la commande:", error);
        setError("Impossible de charger les détails de la commande. Veuillez réessayer.");
        return;
      }
      
      setOrder(data);
    });
  }, [orderId]);
  
  const handleCancelOrder = () => {
    if (!order) return;
    
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      setLoading(true);
      
      orderApi.orderIdDelete(orderId, (error, data, response) => {
        setLoading(false);
        
        if (error) {
          console.error("Erreur lors de l'annulation de la commande:", error);
          setError("Impossible d'annuler la commande. Veuillez réessayer.");
          return;
        }
        
        // Recharger la commande pour mettre à jour son statut
        orderApi.orderIdGet(orderId, (error, data, response) => {
          if (error) {
            setError("La commande a été annulée mais nous n'avons pas pu recharger ses détails.");
            return;
          }
          
          setOrder(data);
        });
      });
    }
  };
  
  if (loading) {
    return (
      <PageContainer>
        <Header />
        <ContentContainer>
          <LoadingState>
            <h2>Chargement des détails de la commande...</h2>
          </LoadingState>
        </ContentContainer>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <Header />
        <ContentContainer>
          <ErrorState>
            <h2>Une erreur est survenue</h2>
            <p>{error}</p>
            <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
          </ErrorState>
        </ContentContainer>
      </PageContainer>
    );
  }
  
  if (!order) {
    return (
      <PageContainer>
        <Header />
        <ContentContainer>
          <ErrorState>
            <h2>Commande introuvable</h2>
            <p>Nous n'avons pas pu trouver la commande demandée.</p>
            <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
          </ErrorState>
        </ContentContainer>
      </PageContainer>
    );
  }
  
  const currentStep = getStatusIndex(order.status);
  const estimatedDeliveryTime = "30-45 minutes";
  
  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <Title>Suivi de commande</Title>
        
        <TrackingCard>
          <StatusHeader>
            <OrderNumber>Commande #{orderId}</OrderNumber>
            <StatusTitle>{statusLabels[order.status] || order.status}</StatusTitle>
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <DeliveryTime>
                <FiClock />
                <span>Livraison estimée: {estimatedDeliveryTime}</span>
              </DeliveryTime>
            )}
          </StatusHeader>
          
          <ProgressTracker>
            <Steps>
              <StepIcon completed={currentStep >= 0} active={currentStep === 0}>
                <FiShoppingBag />
              </StepIcon>
              <StepIcon completed={currentStep >= 1} active={currentStep === 1}>
                <FiCheckSquare />
              </StepIcon>
              <StepIcon completed={currentStep >= 2} active={currentStep === 2}>
                <FiClock />
              </StepIcon>
              <StepIcon completed={currentStep >= 3} active={currentStep === 3}>
                <FiTruck />
              </StepIcon>
              <StepIcon completed={currentStep >= 4} active={currentStep === 4}>
                <FiMapPin />
              </StepIcon>
            </Steps>
            
            <StepLabels>
              <StepLabel completed={currentStep >= 0} active={currentStep === 0}>
                Commande reçue
              </StepLabel>
              <StepLabel completed={currentStep >= 1} active={currentStep === 1}>
                Confirmée
              </StepLabel>
              <StepLabel completed={currentStep >= 2} active={currentStep === 2}>
                En préparation
              </StepLabel>
              <StepLabel completed={currentStep >= 3} active={currentStep === 3}>
                En livraison
              </StepLabel>
              <StepLabel completed={currentStep >= 4} active={currentStep === 4}>
                Livrée
              </StepLabel>
            </StepLabels>
          </ProgressTracker>
          
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <ActionButtons>
              <Button onClick={() => window.location.reload()} variant="outline">
                Actualiser
              </Button>
              {order.status === 'pending' && (
                <Button onClick={handleCancelOrder} variant="danger">
                  Annuler la commande
                </Button>
              )}
            </ActionButtons>
          )}
        </TrackingCard>
        
        <OrderDetailsSection>
          <OrderDetailsCard>
            <CardTitle>
              <FiShoppingBag />
              Détails de la commande
            </CardTitle>
            
            <InfoRow>
              <InfoLabel>Restaurant</InfoLabel>
              <InfoValue>{order.restaurant_name}</InfoValue>
            </InfoRow>
            
            <InfoRow>
              <InfoLabel>Mode de livraison</InfoLabel>
              <InfoValue>{order.delivery_method === 'express' ? 'Express' : 'Standard'}</InfoValue>
            </InfoRow>
            
            <InfoRow>
              <InfoLabel>Mode de paiement</InfoLabel>
              <InfoValue>
                {order.payment_method === 'card' && 'Carte bancaire'}
                {order.payment_method === 'paypal' && 'PayPal'}
                {order.payment_method === 'cash' && 'À la livraison'}
              </InfoValue>
            </InfoRow>
            
            <InfoRow>
              <InfoLabel>Date de commande</InfoLabel>
              <InfoValue>{new Date(order.created_at).toLocaleString()}</InfoValue>
            </InfoRow>
            
            <OrderItems>
              {order.items && order.items.map((item, index) => (
                <OrderItem key={index}>
                  <ItemQuantity>{item.quantity}x</ItemQuantity>
                  <ItemDetails>
                    <ItemName>{item.name}</ItemName>
                    {item.options && Object.keys(item.options).length > 0 && (
                      <ItemOptions>
                        {Object.entries(item.options).map(([key, value]) => `${key}: ${value}`).join(", ")}
                      </ItemOptions>
                    )}
                  </ItemDetails>
                  <ItemPrice>{(item.price * item.quantity).toFixed(2)} €</ItemPrice>
                </OrderItem>
              ))}
            </OrderItems>
            
            <OrderSummary>
              <SummaryRow>
                <span>Sous-total</span>
                <span>{(order.total_price - order.delivery_fee + (order.discount || 0)).toFixed(2)} €</span>
              </SummaryRow>
              <SummaryRow>
                <span>Frais de livraison</span>
                <span>{order.delivery_fee.toFixed(2)} €</span>
              </SummaryRow>
              {order.discount > 0 && (
                <SummaryRow>
                  <span>Remise</span>
                  <span>-{order.discount.toFixed(2)} €</span>
                </SummaryRow>
              )}
              <SummaryRow>
                <span>Total</span>
                <span>{order.total_price.toFixed(2)} €</span>
              </SummaryRow>
            </OrderSummary>
          </OrderDetailsCard>
          
          <OrderDetailsCard>
            <CardTitle>
              <FiUser />
              Coordonnées
            </CardTitle>
            
            {order.contact_info && (
              <>
                <InfoRow>
                  <InfoLabel>Nom</InfoLabel>
                  <InfoValue>{order.contact_info.name}</InfoValue>
                </InfoRow>
                
                <InfoRow>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{order.contact_info.email}</InfoValue>
                </InfoRow>
                
                <InfoRow>
                  <InfoLabel>Téléphone</InfoLabel>
                  <InfoValue>{order.contact_info.phone}</InfoValue>
                </InfoRow>
              </>
            )}
            
            <InfoRow>
              <InfoLabel>Adresse de livraison</InfoLabel>
              <InfoValue>{order.delivery_address}</InfoValue>
            </InfoRow>
            
            {order.additional_info && (
              <InfoRow>
                <InfoLabel>Instructions complémentaires</InfoLabel>
                <InfoValue>{order.additional_info}</InfoValue>
              </InfoRow>
            )}
            
            <ActionButtons>
              <Button onClick={() => navigate("/")} variant="outline">
                Retour à l'accueil
              </Button>
              {(order.status === 'delivered' || order.status === 'cancelled') && (
                <Button onClick={() => navigate("/order/history")}>
                  Voir mes commandes
                </Button>
              )}
            </ActionButtons>
          </OrderDetailsCard>
        </OrderDetailsSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default Tracking; 
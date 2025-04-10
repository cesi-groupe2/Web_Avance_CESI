import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiBell, FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Header from '../../../components/Header';
import NotificationComponent from '../../../components/NotificationComponent';
import OrderApi from '../../../api/OrderApi';
import { useAuth } from '../../../contexts/AuthContext';

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
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
`;

const NotificationBadge = styled.div`
  position: relative;
  cursor: pointer;
  
  svg {
    font-size: 24px;
    color: #666;
  }
  
  .badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ff4d4d;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 1.1rem;
    color: #666;
  }
  
  p {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: #333;
  }
`;

const OrdersSection = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const OrdersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
`;

const OrderTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: ${props => props.active ? '#00a082' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.active ? '#008a70' : '#e0e0e0'};
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OrderCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const OrderId = styled.span`
  font-weight: 600;
  color: #333;
`;

const OrderTime = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const OrderStatus = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'pending':
        return '#fff3cd';
      case 'preparing':
        return '#e3f2fd';
      case 'ready':
        return '#e8f5e9';
      case 'delivered':
        return '#f5f5f5';
      case 'cancelled':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending':
        return '#856404';
      case 'preparing':
        return '#1565c0';
      case 'ready':
        return '#2e7d32';
      case 'delivered':
        return '#666';
      case 'cancelled':
        return '#c62828';
      default:
        return '#666';
    }
  }};
`;

const OrderItems = styled.div`
  margin-top: 10px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.95rem;
`;

const ItemName = styled.span`
  color: #333;
`;

const ItemQuantity = styled.span`
  color: #666;
`;

const OrderActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &.accept {
    background-color: #00a082;
    color: white;
    
    &:hover {
      background-color: #008a70;
    }
  }
  
  &.reject {
    background-color: #ff4d4d;
    color: white;
    
    &:hover {
      background-color: #ff3333;
    }
  }
  
  &.complete {
    background-color: #2196f3;
    color: white;
    
    &:hover {
      background-color: #1976d2;
    }
  }
`;

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetchOrders();
    // Configurer un intervalle pour rafraîchir les commandes toutes les 30 secondes
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Ici, vous devrez implémenter l'appel à votre API pour récupérer les commandes
      // Exemple avec l'API existante :
      orderApi.getOrdersByStatus(activeTab, (error, data) => {
        if (error) {
          setError(error.message);
        } else {
          setOrders(data);
          // Mettre à jour le compteur de notifications
          setNotificationCount(data.filter(order => order.status === 'pending').length);
        }
        setLoading(false);
      });
    } catch (error) {
      setError('Erreur lors du chargement des commandes');
      setLoading(false);
    }
  };

  const handleOrderAction = (orderId, action) => {
    // Implémenter la logique pour accepter/rejeter/compléter une commande
    console.log(`Action ${action} sur la commande ${orderId}`);
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'preparing':
        return 'En préparation';
      case 'ready':
        return 'Prête';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <DashboardHeader>
          <Title>Tableau de bord</Title>
          <NotificationBadge>
            <FiBell />
            {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
          </NotificationBadge>
        </DashboardHeader>

        <DashboardGrid>
          <StatCard>
            <h3>Commandes en attente</h3>
            <p>{orders.filter(order => order.status === 'pending').length}</p>
          </StatCard>
          <StatCard>
            <h3>Commandes en préparation</h3>
            <p>{orders.filter(order => order.status === 'preparing').length}</p>
          </StatCard>
          <StatCard>
            <h3>Commandes prêtes</h3>
            <p>{orders.filter(order => order.status === 'ready').length}</p>
          </StatCard>
        </DashboardGrid>

        <OrdersSection>
          <OrdersHeader>
            <h2>Commandes</h2>
          </OrdersHeader>

          <OrderTabs>
            <Tab 
              active={activeTab === 'pending'} 
              onClick={() => setActiveTab('pending')}
            >
              En attente
            </Tab>
            <Tab 
              active={activeTab === 'preparing'} 
              onClick={() => setActiveTab('preparing')}
            >
              En préparation
            </Tab>
            <Tab 
              active={activeTab === 'ready'} 
              onClick={() => setActiveTab('ready')}
            >
              Prêtes
            </Tab>
          </OrderTabs>

          {loading ? (
            <p>Chargement des commandes...</p>
          ) : error ? (
            <p>Erreur: {error}</p>
          ) : orders.length === 0 ? (
            <p>Aucune commande {activeTab === 'pending' ? 'en attente' : activeTab === 'preparing' ? 'en préparation' : 'prête'}</p>
          ) : (
            <OrdersList>
              {orders.map(order => (
                <OrderCard key={order._id}>
                  <OrderHeader>
                    <div>
                      <OrderId>Commande #{order._id}</OrderId>
                      <OrderTime>
                        {new Date(order.created_at).toLocaleString()}
                      </OrderTime>
                    </div>
                    <OrderStatus status={order.status}>
                      {translateStatus(order.status)}
                    </OrderStatus>
                  </OrderHeader>

                  <OrderItems>
                    {order.items.map((item, index) => (
                      <OrderItem key={index}>
                        <ItemName>{item.name}</ItemName>
                        <ItemQuantity>{item.quantity}x</ItemQuantity>
                      </OrderItem>
                    ))}
                  </OrderItems>

                  <OrderActions>
                    {order.status === 'pending' && (
                      <>
                        <ActionButton 
                          className="accept"
                          onClick={() => handleOrderAction(order._id, 'accept')}
                        >
                          <FiCheckCircle /> Accepter
                        </ActionButton>
                        <ActionButton 
                          className="reject"
                          onClick={() => handleOrderAction(order._id, 'reject')}
                        >
                          <FiXCircle /> Rejeter
                        </ActionButton>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <ActionButton 
                        className="complete"
                        onClick={() => handleOrderAction(order._id, 'complete')}
                      >
                        <FiPackage /> Marquer comme prête
                      </ActionButton>
                    )}
                  </OrderActions>
                </OrderCard>
              ))}
            </OrdersList>
          )}
        </OrdersSection>

        <NotificationComponent userId={currentUser?.id_user} />
      </ContentContainer>
    </PageContainer>
  );
};

export default Dashboard; 
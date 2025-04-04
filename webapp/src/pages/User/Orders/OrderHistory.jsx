import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import { useAuth } from "../../../contexts/AuthContext";

const OrderHistoryContainer = styled.div`
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const OrderHistoryContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
`;

const EmptyStateTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
`;

const OrderCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const OrderInfo = styled.div``;

const OrderNumber = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const OrderDate = styled.p`
  font-size: 14px;
  color: #666;
`;

const OrderStatus = styled.div`
  font-size: 14px;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 20px;
  background-color: ${props => {
    switch (props.status) {
      case 'delivered':
        return '#e8f5e9';
      case 'in-progress':
        return '#e3f2fd';
      case 'cancelled':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'delivered':
        return '#2e7d32';
      case 'in-progress':
        return '#1565c0';
      case 'cancelled':
        return '#c62828';
      default:
        return '#333';
    }
  }};
`;

const OrderItems = styled.div`
  margin-bottom: 20px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 20px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const ItemRestaurant = styled.p`
  font-size: 14px;
  color: #666;
`;

const ItemPrice = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    margin-top: 5px;
  }
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const OrderTotal = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const translateStatus = (status) => {
  switch (status) {
    case 'delivered':
      return 'Livrée';
    case 'in-progress':
      return 'En cours';
    case 'cancelled':
      return 'Annulée';
    default:
      return 'En attente';
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const OrderHistory = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/orders`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Impossible de récupérer l'historique des commandes");
        }

        const data = await response.json();
        
        // Tri des commandes par date (la plus récente en premier)
        const sortedOrders = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  // Pour le développement, utilisons des données fictives
  const mockOrders = [
    {
      id: "ORD-2024-001",
      date: "2025-04-01T14:30:00",
      status: "delivered",
      items: [
        { name: "Pizza Margherita", restaurant: "Pizzeria Luigi", price: "12.99€" },
        { name: "Tiramisu", restaurant: "Pizzeria Luigi", price: "5.99€" }
      ],
      total: "18.98€"
    },
    {
      id: "ORD-2024-002",
      date: "2025-03-28T12:15:00",
      status: "in-progress",
      items: [
        { name: "Sushi Mix", restaurant: "Sushi Palace", price: "22.50€" },
        { name: "Soupe Miso", restaurant: "Sushi Palace", price: "3.50€" }
      ],
      total: "26.00€"
    }
  ];

  return (
    <OrderHistoryContainer>
      <Header />
      <OrderHistoryContent>
        <Title>Mes commandes</Title>

        {loading ? (
          <p>Chargement de vos commandes...</p>
        ) : error ? (
          <p>Erreur: {error}</p>
        ) : mockOrders.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>Aucune commande</EmptyStateTitle>
            <EmptyStateText>Vous n'avez pas encore passé de commande.</EmptyStateText>
            <Link to="/restaurants">
              <Button>Découvrir les restaurants</Button>
            </Link>
          </EmptyState>
        ) : (
          <OrdersGrid>
            {mockOrders.map((order) => (
              <OrderCard key={order.id}>
                <OrderHeader>
                  <OrderInfo>
                    <OrderNumber>Commande #{order.id}</OrderNumber>
                    <OrderDate>{formatDate(order.date)}</OrderDate>
                  </OrderInfo>
                  <OrderStatus status={order.status}>
                    {translateStatus(order.status)}
                  </OrderStatus>
                </OrderHeader>

                <OrderItems>
                  {order.items.map((item, index) => (
                    <OrderItem key={index}>
                      <ItemInfo>
                        <ItemName>{item.name}</ItemName>
                        <ItemRestaurant>{item.restaurant}</ItemRestaurant>
                      </ItemInfo>
                      <ItemPrice>{item.price}</ItemPrice>
                    </OrderItem>
                  ))}
                </OrderItems>

                <OrderFooter>
                  <OrderTotal>Total: {order.total}</OrderTotal>
                  {order.status === 'in-progress' && (
                    <Link to={`/order/tracking/${order.id}`}>
                      <Button size="small">Suivre la commande</Button>
                    </Link>
                  )}
                </OrderFooter>
              </OrderCard>
            ))}
          </OrdersGrid>
        )}
      </OrderHistoryContent>
    </OrderHistoryContainer>
  );
};

export default OrderHistory; 
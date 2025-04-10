import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiBell } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const NotificationButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  color: #333;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const NotificationIcon = styled(FiBell)`
  font-size: 20px;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #d50000;
  color: white;
  font-size: 12px;
  border-radius: 50%;
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 16px;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const NotificationItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
`;

const NotificationMessage = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
`;

const NotificationTime = styled.span`
  font-size: 10px;
  color: #999;
  display: block;
  margin-top: 4px;
`;

const RestaurantNotifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser?.id_restaurant) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications/restaurant/${currentUser.id_restaurant}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: 'relative' }}>
      <NotificationButton onClick={toggleDropdown}>
        <NotificationIcon />
        {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
      </NotificationButton>
      <NotificationDropdown isOpen={isOpen}>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem 
              key={notification.id} 
              onClick={() => markAsRead(notification.id)}
            >
              <NotificationTitle>{notification.title}</NotificationTitle>
              <NotificationMessage>{notification.message}</NotificationMessage>
              <NotificationTime>
                {new Date(notification.created_at).toLocaleString()}
              </NotificationTime>
            </NotificationItem>
          ))
        ) : (
          <NotificationItem>
            <NotificationMessage>Aucune notification</NotificationMessage>
          </NotificationItem>
        )}
      </NotificationDropdown>
    </div>
  );
};

export default RestaurantNotifications; 
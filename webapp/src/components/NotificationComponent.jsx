import React, { useEffect, useState } from 'react';
import NotificationService from '../services/notification';

const NotificationComponent = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [notificationService, setNotificationService] = useState(null);
    const [error, setError] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        if (!userId) {
            setError('ID utilisateur non fourni');
            return;
        }

        try {
            setIsConnecting(true);
            const service = new NotificationService(userId);
            
            service.onNotification((notification) => {
                setNotifications(prev => [notification, ...prev]);
                
                if (Notification.permission === "granted") {
                    new Notification(notification.title, {
                        body: notification.message,
                        icon: '/notification-icon.png'
                    });
                }
            });

            service.connect();
            setNotificationService(service);
            setError(null);
        } catch (err) {
            setError('Erreur lors de l\'initialisation des notifications');
            console.error('Erreur de notification:', err);
        } finally {
            setIsConnecting(false);
        }

        return () => {
            if (notificationService) {
                notificationService.disconnect();
            }
        };
    }, [userId]);

    useEffect(() => {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, []);

    if (error) {
        return (
            <div className="notifications-error">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (isConnecting) {
        return (
            <div className="notifications-loading">
                <p>Connexion aux notifications en cours...</p>
            </div>
        );
    }

    return (
        <div className="notifications-container">
            <h2>Notifications</h2>
            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <p>Aucune notification</p>
                ) : (
                    notifications.map(notification => (
                        <div key={notification.id} className={`notification ${notification.isRead ? 'read' : 'unread'}`}>
                            <h3>{notification.title}</h3>
                            <p>{notification.message}</p>
                            <small>{new Date(notification.createdAt).toLocaleString()}</small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationComponent; 
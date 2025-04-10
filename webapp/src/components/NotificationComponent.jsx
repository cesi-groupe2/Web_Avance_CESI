import React, { useEffect, useState } from 'react';
import NotificationService from '../services/notification';

const NotificationComponent = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [notificationService, setNotificationService] = useState(null);

    useEffect(() => {
        const service = new NotificationService(userId);
        service.connect();
        setNotificationService(service);

        service.onNotification((notification) => {
            setNotifications(prev => [notification, ...prev]);
            
            // Afficher une notification toast
            if (Notification.permission === "granted") {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: '/notification-icon.png'
                });
            }
        });

        return () => {
            service.disconnect();
        };
    }, [userId]);

    // Demander la permission pour les notifications
    useEffect(() => {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, []);

    return (
        <div className="notifications-container">
            <h2>Notifications</h2>
            <div className="notifications-list">
                {notifications.map(notification => (
                    <div key={notification.id} className={`notification ${notification.isRead ? 'read' : 'unread'}`}>
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                        <small>{new Date(notification.createdAt).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationComponent; 
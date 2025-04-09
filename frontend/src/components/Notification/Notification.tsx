import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface NotificationContextType {
  showNotification: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  userId?: string;
  userType?: 'user' | 'restaurant' | 'delivery';
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  userId, 
  userType 
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  useEffect(() => {
    if (!userId || !userType) return;

    const connectWebSocket = () => {
      const ws = new WebSocket(`ws://localhost/ws?userId=${userType}_${userId}`);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          let notificationMessage = '';
          let notificationSeverity: 'success' | 'error' | 'info' | 'warning' = 'info';

          switch (data.type) {
            case 'NEW_ORDER':
              notificationMessage = `Nouvelle commande #${data.orderId}`;
              notificationSeverity = 'info';
              break;
            case 'ORDER_STATUS_UPDATE':
              notificationMessage = `Statut de la commande #${data.orderId} mis à jour: ${data.data.status}`;
              notificationSeverity = 'info';
              break;
            case 'ORDER_READY_FOR_DELIVERY':
              notificationMessage = `Commande #${data.orderId} prête pour la livraison`;
              notificationSeverity = 'success';
              break;
          }

          showNotification(notificationMessage, notificationSeverity);
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      };

      ws.onclose = () => {
        // Tentative de reconnexion après 5 secondes
        setTimeout(connectWebSocket, 5000);
      };

      return ws;
    };

    const ws = connectWebSocket();

    return () => {
      ws.close();
    };
  }, [userId, userType]);

  const showNotification = (msg: string, sev: 'success' | 'error' | 'info' | 'warning') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

interface NotificationProps {
    userId: string;
    userType: 'user' | 'restaurant' | 'delivery';
}

interface NotificationState {
    message: string;
    type: 'NEW_ORDER' | 'ORDER_STATUS_UPDATE' | 'ORDER_READY_FOR_DELIVERY';
    timestamp: string;
    show: boolean;
}

const Notification: React.FC<NotificationProps> = ({ userId, userType }) => {
    const [notifications, setNotifications] = useState<NotificationState[]>([]);
    const { subscribe } = useNotification(userId, userType);

    useEffect(() => {
        const handleNewOrder = (data: any) => {
            setNotifications(prev => [...prev, {
                message: `Nouvelle commande #${data.orderId}`,
                type: 'NEW_ORDER',
                timestamp: data.timestamp,
                show: true
            }]);
        };

        const handleStatusUpdate = (data: any) => {
            setNotifications(prev => [...prev, {
                message: `Statut de la commande #${data.orderId} mis à jour: ${data.data.status}`,
                type: 'ORDER_STATUS_UPDATE',
                timestamp: data.timestamp,
                show: true
            }]);
        };

        const handleOrderReady = (data: any) => {
            setNotifications(prev => [...prev, {
                message: `Commande #${data.orderId} prête pour la livraison`,
                type: 'ORDER_READY_FOR_DELIVERY',
                timestamp: data.timestamp,
                show: true
            }]);
        };

        const unsubscribeNewOrder = subscribe('NEW_ORDER', handleNewOrder);
        const unsubscribeStatusUpdate = subscribe('ORDER_STATUS_UPDATE', handleStatusUpdate);
        const unsubscribeOrderReady = subscribe('ORDER_READY_FOR_DELIVERY', handleOrderReady);

        return () => {
            unsubscribeNewOrder();
            unsubscribeStatusUpdate();
            unsubscribeOrderReady();
        };
    }, [subscribe]);

    useEffect(() => {
        const timer = setInterval(() => {
            setNotifications(prev => 
                prev.map(notification => ({
                    ...notification,
                    show: new Date().getTime() - new Date(notification.timestamp).getTime() < 5000
                }))
            );
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {notifications.map((notification, index) => (
                notification.show && (
                    <div
                        key={index}
                        className={`mb-2 p-4 rounded-lg shadow-lg ${
                            notification.type === 'NEW_ORDER' ? 'bg-blue-500' :
                            notification.type === 'ORDER_STATUS_UPDATE' ? 'bg-yellow-500' :
                            'bg-green-500'
                        } text-white`}
                    >
                        <p>{notification.message}</p>
                        <small>{new Date(notification.timestamp).toLocaleTimeString()}</small>
                    </div>
                )
            ))}
        </div>
    );
};

export default Notification; 
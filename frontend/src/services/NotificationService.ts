import { useEffect, useCallback } from 'react';

type NotificationType = 'NEW_ORDER' | 'ORDER_STATUS_UPDATE' | 'ORDER_READY_FOR_DELIVERY';

interface NotificationData {
    type: NotificationType;
    orderId: string;
    data: {
        userId?: string;
        status?: string;
        restaurantId?: string;
        deliveryPersonId?: string;
    };
    timestamp: string;
}

interface StoredNotification extends NotificationData {
    id: string;
    read: boolean;
}

type NotificationCallback = (data: NotificationData) => void;

class NotificationService {
    private static instance: NotificationService;
    private ws: WebSocket | null = null;
    private callbacks: Map<NotificationType, NotificationCallback[]> = new Map();
    private static readonly MAX_NOTIFICATIONS = 100;

    private constructor() {}

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    public connect(userId: string, userType: 'user' | 'restaurant' | 'delivery'): void {
        if (this.ws) {
            this.ws.close();
        }

        const wsUrl = `ws://localhost/ws?userId=${userType}_${userId}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        this.ws.onmessage = (event) => {
            try {
                const data: NotificationData = JSON.parse(event.data);
                this.handleNotification(data);
                this.storeNotification(data);
            } catch (error) {
                console.error('Error parsing notification:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected from WebSocket');
            setTimeout(() => this.connect(userId, userType), 5000);
        };
    }

    private storeNotification(data: NotificationData): void {
        const storedNotification: StoredNotification = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            read: false
        };

        const notifications = this.getStoredNotifications();
        notifications.unshift(storedNotification);

        // Garder seulement les MAX_NOTIFICATIONS dernières notifications
        if (notifications.length > NotificationService.MAX_NOTIFICATIONS) {
            notifications.pop();
        }

        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    public getStoredNotifications(): StoredNotification[] {
        const stored = localStorage.getItem('notifications');
        return stored ? JSON.parse(stored) : [];
    }

    public markAsRead(notificationId: string): void {
        const notifications = this.getStoredNotifications();
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
    }

    public markAllAsRead(): void {
        const notifications = this.getStoredNotifications();
        notifications.forEach(notification => notification.read = true);
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    public clearNotifications(): void {
        localStorage.removeItem('notifications');
    }

    public subscribe(type: NotificationType, callback: NotificationCallback): void {
        if (!this.callbacks.has(type)) {
            this.callbacks.set(type, []);
        }
        this.callbacks.get(type)?.push(callback);
    }

    public unsubscribe(type: NotificationType, callback: NotificationCallback): void {
        const callbacks = this.callbacks.get(type);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    private handleNotification(data: NotificationData): void {
        const callbacks = this.callbacks.get(data.type);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    public disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Hook React pour utiliser le service de notification
export const useNotification = (userId: string, userType: 'user' | 'restaurant' | 'delivery') => {
    useEffect(() => {
        const notificationService = NotificationService.getInstance();
        notificationService.connect(userId, userType);

        return () => {
            notificationService.disconnect();
        };
    }, [userId, userType]);

    const subscribe = useCallback((type: NotificationType, callback: NotificationCallback) => {
        const notificationService = NotificationService.getInstance();
        notificationService.subscribe(type, callback);

        return () => {
            notificationService.unsubscribe(type, callback);
        };
    }, []);

    const getNotifications = useCallback(() => {
        const notificationService = NotificationService.getInstance();
        return notificationService.getStoredNotifications();
    }, []);

    const markAsRead = useCallback((notificationId: string) => {
        const notificationService = NotificationService.getInstance();
        notificationService.markAsRead(notificationId);
    }, []);

    const markAllAsRead = useCallback(() => {
        const notificationService = NotificationService.getInstance();
        notificationService.markAllAsRead();
    }, []);

    const clearNotifications = useCallback(() => {
        const notificationService = NotificationService.getInstance();
        notificationService.clearNotifications();
    }, []);

    return { 
        subscribe, 
        getNotifications, 
        markAsRead, 
        markAllAsRead, 
        clearNotifications 
    };
};

export default NotificationService; 
import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    List, 
    ListItem, 
    ListItemText, 
    IconButton, 
    Typography,
    Button,
    Box,
    Badge
} from '@mui/material';
import { Close as CloseIcon, Check as CheckIcon, Delete as DeleteIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { useNotification } from '../../services/NotificationService';

interface NotificationHistoryProps {
    open: boolean;
    onClose: () => void;
}

interface Notification {
    id: string;
    type: 'NEW_ORDER' | 'ORDER_STATUS_UPDATE' | 'ORDER_READY_FOR_DELIVERY';
    orderId: string;
    data: {
        userId?: string;
        status?: string;
        restaurantId?: string;
        deliveryPersonId?: string;
    };
    timestamp: string;
    read: boolean;
    message: string;
}

const NotificationHistory: React.FC<NotificationHistoryProps> = ({ open, onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { getNotifications, markAsRead, markAllAsRead, clearNotifications } = useNotification('', 'user');

    useEffect(() => {
        if (open) {
            const storedNotifications = getNotifications();
            const notificationsWithMessage = storedNotifications.map(notification => ({
                ...notification,
                message: `Commande ${notification.orderId}: ${notification.data.status || 'Nouvelle commande'}`
            }));
            setNotifications(notificationsWithMessage);
        }
    }, [open, getNotifications]);

    const getNotificationColor = (type: Notification['type'], read: boolean) => {
        const baseColor = read ? 'bg-gray-100' : 
            type === 'NEW_ORDER' ? 'bg-blue-100' :
            type === 'ORDER_STATUS_UPDATE' ? 'bg-yellow-100' :
            'bg-green-100';
        
        return `${baseColor} ${read ? 'opacity-75' : ''}`;
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleMarkAsRead = (id: string) => {
        markAsRead(id);
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === id 
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const handleClearAll = () => {
        clearNotifications();
        setNotifications([]);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle className="flex justify-between items-center">
                <Typography variant="h6">Historique des notifications</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box className="flex justify-end gap-2 mb-4">
                    <Button
                        variant="outlined"
                        startIcon={<CheckIcon />}
                        onClick={handleMarkAllAsRead}
                        disabled={notifications.every(n => n.read)}
                    >
                        Tout marquer comme lu
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleClearAll}
                        disabled={notifications.length === 0}
                    >
                        Tout effacer
                    </Button>
                </Box>
                <List>
                    {notifications.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="Aucune notification" />
                        </ListItem>
                    ) : (
                        notifications.map((notification) => (
                            <ListItem
                                key={notification.id}
                                className={`${getNotificationColor(notification.type, notification.read)} mb-2 rounded-lg`}
                            >
                                <ListItemText
                                    primary={notification.message}
                                    secondary={formatDate(notification.timestamp)}
                                />
                                {!notification.read && (
                                    <IconButton 
                                        size="small"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                )}
                            </ListItem>
                        ))
                    )}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default NotificationHistory; 
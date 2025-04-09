const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Création du serveur HTTP
const server = http.createServer(app);

// Création du serveur WebSocket
const wss = new WebSocket.Server({ server });

// Stockage des connexions actives
const clients = new Map();

// Gestion des connexions WebSocket
wss.on('connection', (ws, req) => {
    const userId = req.url.split('?userId=')[1];
    
    // Stockage de la connexion
    clients.set(userId, ws);

    // Gestion des messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleMessage(data, ws);
        } catch (error) {
            console.error('Erreur de parsing du message:', error);
        }
    });

    // Gestion de la déconnexion
    ws.on('close', () => {
        clients.delete(userId);
    });
});

// Fonction pour gérer les différents types de messages
function handleMessage(data, ws) {
    switch (data.type) {
        case 'ORDER_CREATED':
            notifyRestaurant(data.orderId, data.restaurantId);
            break;
        case 'ORDER_STATUS_UPDATED':
            notifyUser(data.orderId, data.userId, data.status);
            break;
        case 'ORDER_READY':
            notifyDeliveryPerson(data.orderId, data.deliveryPersonId);
            break;
    }
}

// Fonctions de notification
function notifyRestaurant(orderId, restaurantId) {
    const restaurantWs = clients.get(`restaurant_${restaurantId}`);
    if (restaurantWs) {
        restaurantWs.send(JSON.stringify({
            type: 'NEW_ORDER',
            orderId,
            timestamp: new Date()
        }));
    }
}

function notifyUser(orderId, userId, status) {
    const userWs = clients.get(`user_${userId}`);
    if (userWs) {
        userWs.send(JSON.stringify({
            type: 'ORDER_STATUS_UPDATE',
            orderId,
            status,
            timestamp: new Date()
        }));
    }
}

function notifyDeliveryPerson(orderId, deliveryPersonId) {
    const deliveryWs = clients.get(`delivery_${deliveryPersonId}`);
    if (deliveryWs) {
        deliveryWs.send(JSON.stringify({
            type: 'ORDER_READY_FOR_DELIVERY',
            orderId,
            timestamp: new Date()
        }));
    }
}

// Route de test
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.NOTIFICATION_PORT || 3006;
server.listen(PORT, () => {
    console.log(`Serveur de notification démarré sur le port ${PORT}`);
}); 
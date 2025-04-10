class NotificationService {
    constructor(userId) {
        this.userId = userId;
        this.socket = null;
        this.callbacks = [];
    }

    connect() {
        this.socket = new WebSocket(`ws://localhost:8080/notifications/ws/${this.userId}`);

        this.socket.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            this.callbacks.forEach(callback => callback(notification));
        };

        this.socket.onclose = () => {
            // Tentative de reconnexion après 5 secondes
            setTimeout(() => this.connect(), 5000);
        };
    }

    onNotification(callback) {
        this.callbacks.push(callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

export default NotificationService; 
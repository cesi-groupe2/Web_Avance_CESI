class NotificationService {
    constructor(userId) {
        this.userId = userId;
        this.socket = null;
        this.callbacks = [];
        this.isConnecting = false;
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 3;
    }

    connect() {
        if (this.isConnecting) return;
        this.isConnecting = true;

        try {
            this.socket = new WebSocket(`ws://localhost:8080/notifications/ws/${this.userId}`);

            this.socket.onopen = () => {
                this.isConnecting = false;
                this.connectionAttempts = 0;
                console.log('WebSocket connecté');
            };

            this.socket.onmessage = (event) => {
                try {
                    const notification = JSON.parse(event.data);
                    this.callbacks.forEach(callback => callback(notification));
                } catch (error) {
                    console.error('Erreur lors du traitement du message:', error);
                }
            };

            this.socket.onerror = (error) => {
                console.error('Erreur WebSocket:', error);
                this.isConnecting = false;
            };

            this.socket.onclose = () => {
                this.isConnecting = false;
                if (this.connectionAttempts < this.maxConnectionAttempts) {
                    this.connectionAttempts++;
                    console.log(`Tentative de reconnexion ${this.connectionAttempts}/${this.maxConnectionAttempts}`);
                    setTimeout(() => this.connect(), 5000);
                } else {
                    console.log('Nombre maximum de tentatives de reconnexion atteint');
                }
            };
        } catch (error) {
            console.error('Erreur lors de la création du WebSocket:', error);
            this.isConnecting = false;
        }
    }

    onNotification(callback) {
        this.callbacks.push(callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.isConnecting = false;
        this.connectionAttempts = 0;
    }
}

export default NotificationService; 
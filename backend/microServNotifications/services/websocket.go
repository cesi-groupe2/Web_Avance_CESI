package services

import (
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

type WebSocketService struct {
	clients    map[string]*websocket.Conn
	clientsMux sync.Mutex
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func NewWebSocketService() *WebSocketService {
	return &WebSocketService{
		clients: make(map[string]*websocket.Conn),
	}
}

func (ws *WebSocketService) AddClient(userID string, conn *websocket.Conn) {
	ws.clientsMux.Lock()
	defer ws.clientsMux.Unlock()
	ws.clients[userID] = conn
}

func (ws *WebSocketService) RemoveClient(userID string) {
	ws.clientsMux.Lock()
	defer ws.clientsMux.Unlock()
	delete(ws.clients, userID)
}

func (ws *WebSocketService) SendNotification(userID string, notification interface{}) error {
	ws.clientsMux.Lock()
	conn, exists := ws.clients[userID]
	ws.clientsMux.Unlock()

	if !exists {
		log.Printf("No WebSocket connection found for user %s", userID)
		return nil
	}

	return conn.WriteJSON(notification)
}

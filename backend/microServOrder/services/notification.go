package services

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/gorilla/websocket"
)

type NotificationService struct {
	notificationURL string
}

func NewNotificationService() *NotificationService {
	return &NotificationService{
		notificationURL: "ws://servicenotification:8006",
	}
}

type NotificationMessage struct {
	Type      string      `json:"type"`
	OrderID   string      `json:"orderId"`
	Data      interface{} `json:"data"`
	Timestamp time.Time   `json:"timestamp"`
}

func (ns *NotificationService) SendOrderCreated(orderID string, restaurantID string) error {
	conn, _, err := websocket.DefaultDialer.Dial(ns.notificationURL, nil)
	if err != nil {
		return fmt.Errorf("erreur de connexion au service de notification: %v", err)
	}
	defer conn.Close()

	message := NotificationMessage{
		Type:    "ORDER_CREATED",
		OrderID: orderID,
		Data: map[string]interface{}{
			"restaurantId": restaurantID,
		},
		Timestamp: time.Now(),
	}

	return conn.WriteJSON(message)
}

func (ns *NotificationService) SendOrderStatusUpdated(orderID string, userId string, status string) error {
	conn, _, err := websocket.DefaultDialer.Dial(ns.notificationURL, nil)
	if err != nil {
		return fmt.Errorf("erreur de connexion au service de notification: %v", err)
	}
	defer conn.Close()

	message := NotificationMessage{
		Type:    "ORDER_STATUS_UPDATED",
		OrderID: orderID,
		Data: map[string]interface{}{
			"userId": userId,
			"status": status,
		},
		Timestamp: time.Now(),
	}

	return conn.WriteJSON(message)
} 
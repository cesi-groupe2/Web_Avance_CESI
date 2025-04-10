package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Notification struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	RestaurantID string             `json:"restaurant_id" bson:"restaurant_id"`
	OrderID      string             `json:"order_id" bson:"order_id"`
	Title        string             `json:"title" bson:"title"`
	Message      string             `json:"message" bson:"message"`
	Type         string             `json:"type" bson:"type"`
	IsRead       bool               `json:"is_read" bson:"is_read"`
	CreatedAt    time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt    time.Time          `json:"updated_at" bson:"updated_at"`
}

type OrderDetails struct {
	Items           []OrderItem `bson:"items" json:"items"`
	Total           float64     `bson:"total" json:"total"`
	DeliveryAddress string      `bson:"delivery_address" json:"delivery_address"`
}

type OrderItem struct {
	Name     string  `bson:"name" json:"name"`
	Quantity int     `bson:"quantity" json:"quantity"`
	Price    float64 `bson:"price" json:"price"`
}

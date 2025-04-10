package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Notification struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID    string            `json:"userId" bson:"userId"`
	Title     string            `json:"title" bson:"title"`
	Message   string            `json:"message" bson:"message"`
	Type      string            `json:"type" bson:"type"` // e.g., "info", "warning", "success"
	IsRead    bool              `json:"isRead" bson:"isRead"`
	CreatedAt time.Time         `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time         `json:"updatedAt" bson:"updatedAt"`
} 
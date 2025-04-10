package services

import (
	"context"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServNotifications/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type NotificationServiceImpl struct{}

func (s *NotificationServiceImpl) CreateNotification(ctx context.Context, db *mongo.Database, notification *models.Notification) error {
	collection := db.Collection("notifications")

	notification.CreatedAt = time.Now()
	notification.UpdatedAt = time.Now()
	notification.IsRead = false

	result, err := collection.InsertOne(ctx, notification)
	if err != nil {
		return err
	}

	notification.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (s *NotificationServiceImpl) GetRestaurantNotifications(ctx context.Context, db *mongo.Database, restaurantID string) ([]models.Notification, error) {
	collection := db.Collection("notifications")

	var notifications []models.Notification
	cursor, err := collection.Find(ctx, bson.M{"restaurant_id": restaurantID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &notifications); err != nil {
		return nil, err
	}

	return notifications, nil
}

func (s *NotificationServiceImpl) MarkNotificationAsRead(ctx context.Context, db *mongo.Database, notificationID string) error {
	collection := db.Collection("notifications")

	objID, err := primitive.ObjectIDFromHex(notificationID)
	if err != nil {
		return err
	}

	update := bson.M{
		"$set": bson.M{
			"is_read":    true,
			"updated_at": time.Now(),
		},
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	return err
}

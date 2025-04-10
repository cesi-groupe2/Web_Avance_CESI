package roads

import (
	"context"
	"net/http"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServNotifications/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// HandlerMicroServNotificationsRoads initializes the routes for the notification microservice
func HandlerMicroServNotificationsRoads(server *gin.Engine, database *mongo.Database) *gin.RouterGroup {
	notificationGroup := server.Group("/notifications")

	// Routes pour les notifications
	notificationGroup.GET("/:userId", GetNotifications)
	notificationGroup.POST("/", CreateNotification)
	notificationGroup.DELETE("/:id", DeleteNotification)
	notificationGroup.GET("/unread/:userId", GetUnreadNotifications)
	notificationGroup.PUT("/:id/read", MarkNotificationAsRead)

	return notificationGroup
}

// GetNotifications handles GET requests to retrieve notifications for a user
func GetNotifications(c *gin.Context) {
	userId := c.Param("userId")
	collection := c.MustGet("database").(*mongo.Database).Collection("notifications")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var notifications []models.Notification
	cursor, err := collection.Find(ctx, bson.M{"userId": userId})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &notifications); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notifications)
}

// CreateNotification handles POST requests to create a new notification
func CreateNotification(c *gin.Context) {
	var notification models.Notification
	if err := c.ShouldBindJSON(&notification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	notification.CreatedAt = time.Now()
	notification.UpdatedAt = time.Now()
	notification.IsRead = false

	collection := c.MustGet("database").(*mongo.Database).Collection("notifications")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, notification)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	notification.ID = result.InsertedID.(primitive.ObjectID)
	c.JSON(http.StatusCreated, notification)
}

// DeleteNotification handles DELETE requests to delete a notification
func DeleteNotification(c *gin.Context) {
	notificationId := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(notificationId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notification ID"})
		return
	}

	collection := c.MustGet("database").(*mongo.Database).Collection("notifications")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Notification not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification deleted successfully"})
}

// GetUnreadNotifications handles GET requests to retrieve unread notifications for a user
func GetUnreadNotifications(c *gin.Context) {
	userId := c.Param("userId")
	collection := c.MustGet("database").(*mongo.Database).Collection("notifications")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var notifications []models.Notification
	cursor, err := collection.Find(ctx, bson.M{
		"userId": userId,
		"isRead": false,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &notifications); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notifications)
}

// MarkNotificationAsRead handles PUT requests to mark a notification as read
func MarkNotificationAsRead(c *gin.Context) {
	notificationId := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(notificationId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notification ID"})
		return
	}

	collection := c.MustGet("database").(*mongo.Database).Collection("notifications")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"isRead":    true,
			"updatedAt": time.Now(),
		},
	}

	result, err := collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Notification not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification marked as read"})
}

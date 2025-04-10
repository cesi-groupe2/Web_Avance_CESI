package roads

import (
	"context"
	"net/http"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServNotifications/models"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServNotifications/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type NotificationService interface {
	CreateNotification(ctx context.Context, db *mongo.Database, notification *models.Notification) error
	GetRestaurantNotifications(ctx context.Context, db *mongo.Database, restaurantID string) ([]models.Notification, error)
	MarkNotificationAsRead(ctx context.Context, db *mongo.Database, notificationID string) error
}

var notificationService NotificationService = &services.NotificationServiceImpl{}

func SetupRoutes(r *gin.Engine, db *mongo.Database) {
	// Routes pour les notifications
	r.POST("/notifications", func(c *gin.Context) {
		createNotification(c, db)
	})

	r.GET("/notifications/restaurant/:restaurantId", func(c *gin.Context) {
		getRestaurantNotifications(c, db)
	})

	r.PUT("/notifications/:id/read", func(c *gin.Context) {
		markNotificationAsRead(c, db)
	})
}

func createNotification(c *gin.Context, db *mongo.Database) {
	var notification models.Notification
	if err := c.ShouldBindJSON(&notification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	notification.CreatedAt = time.Now()
	notification.UpdatedAt = time.Now()
	notification.IsRead = false

	if err := notificationService.CreateNotification(c.Request.Context(), db, &notification); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, notification)
}

func getRestaurantNotifications(c *gin.Context, db *mongo.Database) {
	restaurantID := c.Param("restaurantId")
	if restaurantID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "restaurantId is required"})
		return
	}

	notifications, err := notificationService.GetRestaurantNotifications(c.Request.Context(), db, restaurantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notifications)
}

func markNotificationAsRead(c *gin.Context, db *mongo.Database) {
	notificationID := c.Param("id")
	if notificationID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "notification id is required"})
		return
	}

	if err := notificationService.MarkNotificationAsRead(c.Request.Context(), db, notificationID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification marked as read"})
}

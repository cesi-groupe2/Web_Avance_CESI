package roads

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServNotifications/ws"
)



func SetupRoutes(router *gin.Engine, db *mongo.Database) (*gin.RouterGroup) {
	// Create a new router group for the notifications
	notificationsGroup := router.Group("/notifications")
	restaurantGroup := notificationsGroup.Group("/restaurant")
	{
		restaurantGroup.GET("/connectWs", ws.HandleWsForRestaurant)
		restaurantGroup.GET("/notify/:idRestaurant", ws.NotifyRestaurant)
	}
	deliveryPersonGroup := notificationsGroup.Group("/deliveryPerson")
	{
		deliveryPersonGroup.GET("/connectWs", ws.HandleWsForDeliveryPerson)
		deliveryPersonGroup.GET("/notify/:idDeliveryPerson", ws.NotifyDeliveryPerson)	
	}
	clientGroup := notificationsGroup.Group("/client")
	{
		clientGroup.GET("/connectWs", ws.HandleWsForClient)
		clientGroup.GET("/notify/:idClient", ws.NotifyClient)
	}
	return notificationsGroup
}

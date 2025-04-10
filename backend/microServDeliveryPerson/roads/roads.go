package roads

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares"
	DeliveryPersonService "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServDeliveryPerson/services"
	"github.com/gin-gonic/gin"
)

func HandlermicroservDelPersRoads(server *gin.Engine) *gin.RouterGroup {
	// Create a new router group for the delivery person microservice
	deliveryPerson := server.Group("/deliveryperson", middlewares.AuthMiddleware())

	deliveryPerson.POST("/setStatus/:status", func(ctx *gin.Context) {
		DeliveryPersonService.SetStatus(ctx)
	})
	deliveryPerson.GET("/getStatus/nearby/:latitude/:longitude/", func(ctx *gin.Context) {
		DeliveryPersonService.GetNearbyDeliveryPersons(ctx)
	})

	return deliveryPerson
}

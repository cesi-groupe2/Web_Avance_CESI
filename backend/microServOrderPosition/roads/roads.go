package roads

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microSerOrderPosition/services"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func HandlerMicroServOrderPositionRoads(server *gin.Engine, database *mongo.Database) *gin.RouterGroup {

	orderPosition := server.Group("/orderPosition", middlewares.AuthMiddleware())
	orderPosition.GET("/lastPosition/:orderID", func(ctx *gin.Context) {
		orderPositionService.GetLastPositionByOrderID(ctx, database)
	})
	orderPosition.GET("/journey/:orderID", func(ctx *gin.Context) {
		orderPositionService.GetJourneyByOrderID(ctx, database)
	})
	orderPosition.POST("/", func(ctx *gin.Context) {
		orderPositionService.CreateOrderPosition(ctx, database)
	})
	orderPosition.POST("/createLite", func(ctx *gin.Context) {
		orderPositionService.CreateOrderPositionLite(ctx, database)
	})

	return orderPosition
}

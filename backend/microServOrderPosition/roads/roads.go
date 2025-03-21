package roads

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microSerOrderPosition/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func HandlerMicroServOrderPositionRoads(server *gin.Engine, database *mongo.Database) {
	server.GET("/lastPosition/:orderID", func(ctx *gin.Context) {
		orderPositionService.GetLastPositionByOrderID(ctx, database)
	})
	server.GET("/journey/:orderID", func(ctx *gin.Context) {
		orderPositionService.GetJourneyByOrderID(ctx, database)
	})
	server.POST("/", func(ctx *gin.Context) {
		orderPositionService.CreateOrderPosition(ctx, database)
	})
	server.POST("/createLite", func(ctx *gin.Context) {
		orderPositionService.CreateOrderPositionLite(ctx, database)
	})
}

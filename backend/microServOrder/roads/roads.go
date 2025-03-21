package roads

import (
	orderService "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServOrder/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func HandlerMicroServOrderRoads(server *gin.Engine, database *mongo.Database) {
	server.GET("/all", func(ctx *gin.Context) {
		orderService.GetAllOrder(ctx, database)
	})
	server.GET("/:orderId", func(ctx *gin.Context) {
		orderService.GetOrderById(ctx, database)
	})
	server.POST("/", func(ctx *gin.Context) {
		orderService.CreateOrder(ctx, database)
	})
	server.PATCH("/", func(ctx *gin.Context) {
		orderService.UpdateOrder(ctx, database)
	})
	server.DELETE("/:orderId", func(ctx *gin.Context) {
		orderService.DeleteOrder(ctx, database)
	})
	server.PUT("/nextStatus/:orderId", func(ctx *gin.Context) {
		orderService.UpdateToNextStatus(ctx, database)
	})
}

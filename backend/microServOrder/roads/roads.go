package roads

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares"
	orderService "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServOrder/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func HandlerMicroServOrderRoads(server *gin.Engine, database *mongo.Database) *gin.RouterGroup {
	order := server.Group("/order", middlewares.AuthMiddleware())
	order.GET("/all", func(ctx *gin.Context) {
		orderService.GetAllOrder(ctx, database)
	})
	order.GET("/:orderId", func(ctx *gin.Context) {
		orderService.GetOrderById(ctx, database)
	})
	order.POST("/", func(ctx *gin.Context) {
		orderService.CreateOrder(ctx, database)
	})
	order.PATCH("/", func(ctx *gin.Context) {
		orderService.UpdateOrder(ctx, database)
	})
	order.DELETE("/:orderId", func(ctx *gin.Context) {
		orderService.DeleteOrder(ctx, database)
	})
	order.PUT("/nextStatus/:orderId", func(ctx *gin.Context) {
		orderService.UpdateToNextStatus(ctx, database)
	})

	return order
}

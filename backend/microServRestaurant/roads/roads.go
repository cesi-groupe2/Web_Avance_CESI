package roads

import (
	restaurantService "microservrestaurant/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlerMicroServRestaurantRoads(server *gin.Engine , sqlClient *gorm.DB) {
	server.GET("/:restaurantId", func(ctx *gin.Context) {
		restaurantService.GetRestaurantById(ctx, sqlClient)
	})
	server.GET("/:restaurantId/menuitems", func(ctx *gin.Context) {
		restaurantService.GetMenuItemsByRestaurantId(ctx, sqlClient)
	})
	server.GET("/nearby", func(ctx *gin.Context) {
		restaurantService.GetNearbyRestaurants(ctx, sqlClient)
	})
}

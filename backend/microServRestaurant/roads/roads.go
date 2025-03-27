package roads

import (
	restaurantService "microservrestaurant/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlerMicroServRestaurantRoads(server *gin.Engine , sqlClient *gorm.DB) {
	restaurant := server.Group("/restaurant")
	
	restaurant.GET("/restaurant/:restaurantId", func(ctx *gin.Context) {
		restaurantService.GetRestaurantById(ctx, sqlClient)
	})
	restaurant.GET("/restaurant/:restaurantId/menuitems", func(ctx *gin.Context) {
		restaurantService.GetMenuItemsByRestaurantId(ctx, sqlClient)
	})
	restaurant.GET("/restaurant/nearby", func(ctx *gin.Context) {
		restaurantService.GetNearbyRestaurants(ctx, sqlClient)
	})
}

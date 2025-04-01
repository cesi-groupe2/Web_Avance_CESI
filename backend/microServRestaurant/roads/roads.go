package roads

import (
	restaurantService "github.com/cesi-groupe2/Web_Avance_CESI/backend/microservrestaurant/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlerMicroServRestaurantRoads(server *gin.Engine , sqlClient *gorm.DB) *gin.RouterGroup {
	restaurant := server.Group("/restaurant")
	restaurant.GET("/:restaurantId", func(ctx *gin.Context) {
		restaurantService.GetRestaurantById(ctx, sqlClient)
	})
	restaurant.GET("/:restaurantId/menuitems", func(ctx *gin.Context) {
		restaurantService.GetMenuItemsByRestaurantId(ctx, sqlClient)
	})
	restaurant.GET("/nearby", func(ctx *gin.Context) {
		restaurantService.GetNearbyRestaurants(ctx, sqlClient)
	})

	return restaurant
}

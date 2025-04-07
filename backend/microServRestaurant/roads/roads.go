package roads

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares"
	restaurantService "github.com/cesi-groupe2/Web_Avance_CESI/backend/microservrestaurant/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlerMicroServRestaurantRoads(server *gin.Engine , sqlClient *gorm.DB) *gin.RouterGroup {
	restaurant := server.Group("/restaurant", middlewares.AuthMiddleware())
	restaurant.GET("/:restaurantId", func(ctx *gin.Context) {
		restaurantService.GetRestaurantById(ctx, sqlClient)
	})
	restaurant.GET("/nearby", func(ctx *gin.Context) {
		restaurantService.GetNearbyRestaurants(ctx, sqlClient)
	})
	restaurant.GET("/my", func(ctx *gin.Context) {
		restaurantService.GetMyRestaurants(ctx, sqlClient)
	})
	restaurant.POST("/new", func(ctx *gin.Context) {
		restaurantService.CreateRestaurant(ctx, sqlClient)
	})

	restaurant.GET("/:restaurantId/menuitems", func(ctx *gin.Context) {
		restaurantService.GetMenuItemsByRestaurantId(ctx, sqlClient)
	})
	restaurant.POST("/:restaurantId/menuitems/new", func(ctx *gin.Context) {
		restaurantService.CreateMenuItem(ctx, sqlClient)
	})

	menuItemGroup := restaurant.Group("/:restaurantId/menuitems")
	menuItemGroup.GET("/:menuItemId", func(ctx *gin.Context) {
		restaurantService.GetMenuItemById(ctx, sqlClient)
	})
	menuItemGroup.PUT("/:menuItemId", func(ctx *gin.Context) {
		restaurantService.UpdateMenuItem(ctx, sqlClient)
	})
	menuItemGroup.DELETE("/:menuItemId", func(ctx *gin.Context) {
		restaurantService.DeleteMenuItem(ctx, sqlClient)
	})
	return restaurant
}

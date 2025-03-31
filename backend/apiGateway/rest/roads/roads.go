package roads

import (
	"context"

	"github.com/gin-gonic/gin"
)

func HandleApiRoads(ctx context.Context, router *gin.Engine) {
	
	api := router.Group("/api")
	api.GET("/test", TestRoad(ctx))

	HandleUsersRoads(ctx, api)
	HandleOrdersRoads(ctx, api)
	
}

// TestRoad godoc
// @Summary Testing route
// @Description Testing route isn't use
// @Router /test [get]
func TestRoad(ctx context.Context) (gin.HandlerFunc) {
	return func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "test",
		})
	}
}

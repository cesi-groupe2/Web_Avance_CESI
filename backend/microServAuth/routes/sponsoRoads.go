package roads

import (
	authController "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/controllers"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlerMicroServSponsoRoads(server *gin.Engine, sqlClient *gorm.DB) *gin.RouterGroup {
	sponsoGroup := server.Group("/sponso")
	sponsoGroup.GET("/:code", func(ctx *gin.Context) {
		authController.SponsoriseByCode(ctx, sqlClient)
	})
	sponsoGroup.GET("/mycode", func(ctx *gin.Context) {
		authController.GetMyCode(ctx, sqlClient)
	})
	return sponsoGroup
}
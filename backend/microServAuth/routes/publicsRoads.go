package roads

import (
	authController "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/controllers"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)


func HandlerMicroServAuthPublicRoads(server *gin.Engine, sqlClient *gorm.DB) *gin.RouterGroup {
	public := server.Group("/public")
	public.POST("/register", func(ctx *gin.Context) {
		authController.Register(ctx, sqlClient)
	})
	
	public.POST("/login", func(ctx *gin.Context) {
		authController.Login(ctx, sqlClient)
	})
	return public
}


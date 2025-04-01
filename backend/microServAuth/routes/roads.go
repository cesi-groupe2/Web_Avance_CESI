package roads

import (
	authController "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/controllers"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/middlewares"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlerMicroServAuthRoads(server *gin.Engine , sqlClient *gorm.DB) {
	server.POST("/register", func(ctx *gin.Context) {
		authController.Register(ctx, sqlClient)
	})

	auth := server.Group("/auth", middlewares.AuthMiddleware())
	auth.POST("/login", func(ctx *gin.Context) {
		authController.Login(ctx, sqlClient)
	})
	auth.POST("/refreshToken", authController.RefreshToken)
	auth.POST("/logout", authController.Logout)
	auth.GET("/canAccess/:roleId", func(ctx *gin.Context) {
		middlewares.CanAccessMiddleware(ctx)
	})
	
}

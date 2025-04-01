package roads

import (
	authController "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/controllers"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/middlewares"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlerMicroServAuthRoads(server *gin.Engine , sqlClient *gorm.DB) *gin.RouterGroup {
	auth := server.Group("/auth")
	auth.POST("/register", func(ctx *gin.Context) {
		authController.Register(ctx, sqlClient)
	})

	auth.POST("/login", middlewares.AuthMiddleware(), func(ctx *gin.Context) {
		authController.Login(ctx, sqlClient)
	})
	auth.POST("/refreshToken", middlewares.AuthMiddleware(), authController.RefreshToken)
	auth.POST("/logout", middlewares.AuthMiddleware(), authController.Logout)
	auth.GET("/canAccess/:roleId", middlewares.AuthMiddleware(), func(ctx *gin.Context) {
		middlewares.CanAccessMiddleware(ctx)
	})

	return auth
	
}

package roads

import (
	authController "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/controllers"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlerMicroServAuthPrivateRoads(server *gin.Engine, sqlClient *gorm.DB) *gin.RouterGroup {
	auth := server.Group("/auth", middlewares.AuthMiddleware())
	auth.POST("/refreshToken", authController.RefreshToken)
	auth.POST("/logout", authController.Logout)
	auth.POST("/resetPwd/:userId", func(ctx *gin.Context) {
		authController.ResetPwd(ctx, sqlClient)
	})
	auth.GET("/me", func(ctx *gin.Context) {
		authController.GetMe(ctx, sqlClient)
	})
	auth.DELETE("/delete-account", func(ctx *gin.Context) {
		authController.DeleteAccount(ctx, sqlClient)
	})
	auth.POST("/update-profile", func(ctx *gin.Context) {
		authController.UpdateProfile(ctx, sqlClient)
	})

	return auth
}

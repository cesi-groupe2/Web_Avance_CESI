package roads

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/middlewares"
	userService "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServUsers/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlerMicroServUsersRoads(server *gin.Engine, dbclient *gorm.DB) *gin.RouterGroup {
	users := server.Group("/users", middlewares.AuthMiddleware())
	users.GET("/", func(c *gin.Context) {
		userService.GetUser(c, dbclient)
	})

	return users
}

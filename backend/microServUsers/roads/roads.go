package roads

import (
	userService "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServUsers/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlerMicroServUsersRoads(server *gin.Engine, dbclient *gorm.DB) {
	server.GET("/users", func(c *gin.Context) {
		userService.GetUser(c, dbclient)
	})
}

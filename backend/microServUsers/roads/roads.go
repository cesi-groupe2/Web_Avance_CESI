package roads

import (
	userService "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServUsers/service"
	"github.com/gin-gonic/gin"
)

func HandlerMicroServUsersRoads(server *gin.Engine) {
	server.GET("/users", userService.GetUser)
}

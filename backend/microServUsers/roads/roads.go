package roads

import (
	userService "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServUsers/service"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func HandlerMicroServUsersRoads(server *gin.Engine, dbclient *mongo.Client) {
	server.GET("/users", func(c *gin.Context) {
		userService.GetUser(c, dbclient)
	})
}

package roads

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlerMicroServAuthRoads(server *gin.Engine , sqlClient *gorm.DB) *gin.RouterGroup {
	publicGroup := HandlerMicroServAuthPublicRoads(server, sqlClient)
	HandlerMicroServAuthPrivateRoads(server, sqlClient)

	return publicGroup
}

package userService

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetUser(c *gin.Context, dbclient *gorm.DB) {
	c.JSON(200, "TO DO")
}

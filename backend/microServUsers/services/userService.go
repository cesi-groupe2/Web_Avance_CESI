package userService

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"

)

// GetUser godoc
// @Summary      Get user by ID
// @Description  Get user by ID
// @Tags         users
// @Accept       json
// @Produce      json
// @Security BearerAuth
// @Param        id   path      string  true  "User ID"
// @Success      200  {object}  model.User
func GetUser(c *gin.Context, dbclient *gorm.DB) {
	userId := c.Param("id")
	
	var user model.User
	if err := dbclient.First(&user, userId).Error; err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}
	c.JSON(200, user)
}

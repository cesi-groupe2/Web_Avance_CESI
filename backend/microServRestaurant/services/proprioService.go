package restaurantService

import (
	"fmt"
	"log"


	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/columns"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GetProprioByRestaurantId godoc
//	@Summary		Get restaurant owner by restaurant ID
//	@Description	Get restaurant owner by restaurant ID
//	@Tags			restaurant
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			restaurantId	path		string	true	"Restaurant ID"
//	@Success		200				{object}	model.User
//	@Failure		404				{object}	string
//	@Failure		500				{object}	string
//	@Router			/restaurant/{restaurantId}/proprio [get]
func GetProprioByRestaurantId(ctx *gin.Context, db *gorm.DB) {
	restaurantId := ctx.Param("restaurantId")
	var possetion model.Posseder
	if err := db.Where((fmt.Sprint("%s = ?", columns.PosserderColumnIDRestaurant)), restaurantId).First(&possetion).Error; err != nil {
		log.Println("Error getting restaurant owner:", err)
		ctx.JSON(404, gin.H{"error": "Restaurant owner not found"})
		return
	}

	var user model.User
	if err := db.Where((fmt.Sprint("%s = ?", columns.PosserderColumnIDPosserder)), possetion.IDUser).First(&user).Error; err != nil {
		log.Println("Error getting user:", err)
		ctx.JSON(404, gin.H{"error": "User not found"})
		return
	}
	ctx.JSON(200, user)
}
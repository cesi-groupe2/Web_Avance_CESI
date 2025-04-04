package restaurantService

import (
	"fmt"
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/columns"
)

// GetNearbyRestaurants godoc
//	@Summary		Get nearby restaurants
//	@Description	Get nearby restaurants from the user's location
//	@Tags			restaurant
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			latitude	path		string	true	"Latitude of the user"
//	@Param			longitude	path		string	true	"Longitude of the user"
//	@Param			kmAround	path		string	true	"Distance around the user in km"
//	@Success		200			{array}		model.Restaurant
//	@Failure		400			{object}	map[string]string
//	@Router			/restaurant/nearby/{latitude}/{longitude}/{kmAround} [get]
func GetNearbyRestaurants(ctx *gin.Context, db *gorm.DB) {
	userLatitudeStr := ctx.Param("latitude")
	userLongitudeStr := ctx.Param("longitude")
	kmAroundStr := ctx.Param("kmAround")

	userLatitude, err1 := strconv.ParseFloat(userLatitudeStr, 64)
	if err1 != nil {
		ctx.JSON(400, gin.H{"error": "Invalid latitude"})
		return
	}

	userLongitude, err2 := strconv.ParseFloat(userLongitudeStr, 64)
	if err2 != nil {
		ctx.JSON(400, gin.H{"error": "Invalid longitude"})
		return
	}

	kmAround, err3 := strconv.ParseFloat(kmAroundStr, 64)
	if err3 != nil {
		ctx.JSON(400, gin.H{"error": "Invalid kmAround"})
		return
	}

	var nearbyRestaurants []model.Restaurant
	db.Where(fmt.Sprintf("%s BETWEEN ? AND ?", columns.RestaurantColumnLocalisationLatitude), userLatitude-kmAround, userLatitude+kmAround).
		Where(fmt.Sprintf("%s BETWEEN ? AND ?", columns.RestaurantColumnLocalisationLongitude), userLongitude-kmAround, userLongitude+kmAround).
		Find(&nearbyRestaurants)

	ctx.JSON(200, nearbyRestaurants)
}

// GetRestaurantById godoc
//	@Summary		Get a restaurant by its id
//	@Description	Get a restaurant by its id
//	@Tags			restaurant
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			restaurantId	path		string	true	"Restaurant ID"
//	@Success		200				{object}	model.Restaurant
//	@Failure		400				{object}	map[string]string
//	@Router			/restaurant/{restaurantId} [get]
func GetRestaurantById(ctx *gin.Context, db *gorm.DB) {
	restaurantId := ctx.Param("restaurantId")
	var restaurant model.Restaurant
	result := db.First(&restaurant, restaurantId)
	if result.Error != nil {
		log.Println(result.Error)
		ctx.JSON(400, gin.H{"error": "Restaurant not found"})
		return
	}
	ctx.JSON(200, restaurant)
}

// GetMenuItemsByRestaurantId godoc
//	@Summary		Get menu items by restaurant id
//	@Description	Get menu items by restaurant id
//	@Tags			restaurant
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			restaurantId	path		string	true	"Restaurant ID"
//	@Success		200				{array}		model.Menuitem
//	@Failure		400				{object}	map[string]string
//	@Router			/restaurant/{restaurantId}/menuitems [get]
func GetMenuItemsByRestaurantId(ctx *gin.Context, db *gorm.DB) {
	restaurantId := ctx.Param("restaurantId")
	var menuItems []model.Menuitem
	db.Where(columns.MenuitemColumnCreatedAtColumn+" = ?", restaurantId).Find(&menuItems)
	ctx.JSON(200, menuItems)
}

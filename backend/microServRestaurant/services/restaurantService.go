package restaurantService

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares/jwtActions"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/columns"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
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

// GetMyRestaurants godoc
//	@Summary		Get the restaurants owned by the user
//	@Description	Get the restaurants owned by the user
//	@Tags			restaurant
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Success		200	{array}		model.Restaurant
//	@Failure		400	{object}	map[string]string
//	@Router			/restaurant/my [get]
func GetMyRestaurants(ctx *gin.Context, db *gorm.DB) {
	userId, err := jwtActions.GetUserIdFromToken(ctx)
	if err != nil {
		log.Println("Error getting userId from token:", err)
		ctx.JSON(500, gin.H{"error": "Error getting userId from token"})
		return
	}

	// Get associated restaurants
	var possede model.Posseder
	result := db.Where(fmt.Sprintf("%s = ?", columns.PosserderColumnIDPosserder), userId).
		Find(&possede)
	if result.Error != nil {
		log.Println(result.Error)
		ctx.JSON(400, gin.H{"error": "User not found"})
		return
	}

	// Get restaurants by ID
	var restaurants []model.Restaurant
	result = db.Where(fmt.Sprintf("%s = ?", columns.RestaurantColumnIDRestaurant), possede.IDRestaurant).
		Find(&restaurants)
	if result.Error != nil {
		log.Println(result.Error)
		ctx.JSON(400, gin.H{"error": "Restaurants not found"})
		return
	}
	ctx.JSON(200, restaurants)
}

// CreateRestaurant godoc
//	@Summary		Create a new restaurant
//	@Description	Create a new restaurant
//	@Tags			restaurant
//	@Security		BearerAuth
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			name					formData	string				true	"Name of the restaurant"
//	@Param			phone					formData	string				true	"Phone number of the restaurant"
//	@Param			address					formData	string				true	"Address of the restaurant"
//	@Param			localisation_latitude	formData	string				true	"Latitude of the restaurant"
//	@Param			localisation_longitude	formData	string				true	"Longitude of the restaurant"
//	@Param			opening_hours			formData	model.OpeningHours	true	"Opening hours of the restaurant (in JSON format)"
//	@Param			picture					formData	file				true	"Picture of the restaurant"
//	@Success		201						{object}	model.Restaurant
//	@Failure		400						{object}	map[string]string
//	@Failure		500						{object}	map[string]string
//	@Router			/restaurant/new [post]
func CreateRestaurant(ctx *gin.Context, db *gorm.DB) {
	name := ctx.PostForm("name")
	phone := ctx.PostForm("phone")
	address := ctx.PostForm("address")
	localisationLatitude := ctx.PostForm("localisation_latitude")
	localisationLongitude := ctx.PostForm("localisation_longitude")
	openingHoursStr := ctx.PostForm("opening_hours")

	if name == "" || phone == "" || address == "" || localisationLatitude == "" || localisationLongitude == "" || openingHoursStr == "" {
		log.Println(fmt.Sprintf("Missing required fields: name=%s, phone=%s, address=%s, localisation_latitude=%s, localisation_longitude=%s, opening_hours=%s", name, phone, address, localisationLatitude, localisationLongitude, openingHoursStr))
		ctx.JSON(400, gin.H{"error": "Missing required fields"})
		return
	}

	// get the picture from the request
	picture, err := utils.PictureFromForm(ctx, "picture")
	if err != nil {
		picture = []byte{}
	}

	// Parse the opening_hours JSON into the model.OpeningHours struct.
	var openingHours model.OpeningHours
	if err := json.Unmarshal([]byte(openingHoursStr), &openingHours); err != nil {
		log.Println("Invalid opening_hours:", err)
		ctx.JSON(400, gin.H{"error": "Invalid opening_hours"})
		return
	}

	// Convert file object to byte array.
	// TO DO

	// Convert latitude and longitude to float64.
	localisationLatitudeFloat, err := strconv.ParseFloat(localisationLatitude, 64)
	if err != nil {
		log.Println("Invalid latitude:", err)
		ctx.JSON(400, gin.H{"error": "Invalid latitude"})
		return
	}
	localisationLongitudeFloat, err := strconv.ParseFloat(localisationLongitude, 64)
	if err != nil {
		log.Println("Invalid longitude:", err)
		ctx.JSON(400, gin.H{"error": "Invalid longitude"})
		return
	}

	restaurant := model.Restaurant{
		Name:                  name,
		Phone:                 phone,
		Address:               address,
		LocalisationLatitude:  localisationLatitudeFloat,
		LocalisationLongitude: localisationLongitudeFloat,
		OpeningHours:          openingHoursStr,
		Picture:               picture,
	}

	result := db.Create(&restaurant)
	if result.Error != nil {
		log.Println("Error creating restaurant:", result.Error)
		ctx.JSON(500, gin.H{"error": "Error creating restaurant"})
		return
	}

	// Add the user as the owner of the restaurant.
	userId, err := jwtActions.GetUserIdFromToken(ctx)
	if err != nil {
		log.Println("Error getting userId from token:", err)
		ctx.JSON(500, gin.H{"error": "Error getting userId from token"})
		return
	}

	var possede model.Posseder
	possede.IDRestaurant = restaurant.IDRestaurant
	possede.IDUser = int32(userId)
	result = db.Create(&possede)
	if result.Error != nil {
		log.Println("Error creating restaurant ownership:", result.Error)
		ctx.JSON(500, gin.H{"error": "Error creating restaurant"})
		return
	}
	ctx.JSON(201, restaurant)
}

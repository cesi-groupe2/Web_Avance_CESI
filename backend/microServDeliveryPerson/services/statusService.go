package DeliveryPersonService

import (
	"fmt"
	"log"
	"strconv"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares/jwtActions"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/customModels"
	"github.com/gin-gonic/gin"
)

// SetStatus godoc
// @Summary		Set the status of a delivery person
// @Description	Set the status of a delivery person
// @Tags		deliveryPerson
// @Accept		json
// @Produce	json
// Security	BearerAuth
// @Param		status	path		string	true	"Status of the delivery person"
// @Param		longitude	formData	string	true	"Longitude of the delivery person"
// @Param		latitude	formData	string	true	"Latitude of the delivery person"
// @Success	200	{object}	customModels.DeliveryPersonStatus
// @Failure	400	{object}	string
// @Failure	500	{object}	string
// @Router		/deliveryperson/setStatus/{status} [post]
func SetStatus(ctx *gin.Context){
	status := ctx.Param("status")
	longitude, err := strconv.ParseFloat(ctx.PostForm("longitude"), 64)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid longitude"})
		return
	}
	latitude, err := strconv.ParseFloat(ctx.PostForm("latitude"), 64)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid latitude"})
		return
	}
	userId, err := jwtActions.GetUserIdFromToken(ctx)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid token"})
		return
	}

	var deliveryPersStatus customModels.DeliveryPersonStatus
	if status == customModels.StatusStart{
		deliveryPersStatus = customModels.DeliveryPersonStatus{
			IDUser: userId,
			Status: customModels.StatusAvailable,
			Longitude: longitude,
			Latitude: latitude,
		}
		log.Println(fmt.Sprintf("User %d is starting", userId))
	} else {
		deliveryPersStatus = customModels.DeliveryPersonStatus{
			IDUser: userId,
			Status: status,
			Longitude: longitude,
			Latitude: latitude,
		}
	}
	customModels.AddUserInWork(deliveryPersStatus)
	fmt.Println("User %s is %s", userId, deliveryPersStatus.Status)
	ctx.JSON(200, gin.H{"status": deliveryPersStatus})	
}


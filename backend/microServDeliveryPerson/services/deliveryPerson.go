package DeliveryPersonService

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/customModels"
	"github.com/gin-gonic/gin"
)

// GerNearbyDeliveryPersons godoc
// @Summary Get nearby delivery persons
// @Description Get nearby delivery persons
// @Tags deliveryPerson
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param latitude path string true "Latitude of the delivery person"
// @Param longitude path string true "Longitude of the delivery person"
// @Success 200 {object} []customModels.DeliveryPersonStatus
// @Failure 400 {object} string
// @Failure 500 {object} string
// @Router /deliveryperson/getStatus/nearby/{latitude}/{longitude} [get]
func GetNearbyDeliveryPersons(ctx *gin.Context) {
	latitude := ctx.Param("latitude")
	longitude := ctx.Param("longitude")

	// Call the function to get nearby delivery persons
	deliveryPersons := customModels.GetNearbyDeliveryPersons(latitude, longitude)
	if len(deliveryPersons) == 0 {
		ctx.JSON(404, gin.H{"message": "No delivery persons found nearby"})
		return
	}
	ctx.JSON(200, gin.H{"deliveryPersons": deliveryPersons})
}

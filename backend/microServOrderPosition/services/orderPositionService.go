package orderPositionService

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/mongoDBMain/mongoModels"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// GetLastPositionByOrderID godoc
//	@Summary		Get the last position of an order by its id
//	@Description	Get the last position of an order by its id
//	@Tags			OrderPosition
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			orderID	path		int	true	"Order ID"
//	@Success		200		{object}	mongoModels.OrderPositionHistory
//	@Failure		400		{object}	string
//	@Failure		500		{object}	string
//	@Router			/lastPosition/{orderID} [get]
func GetLastPositionByOrderID(ctx *gin.Context, database *mongo.Database) {
	orderID, err := strconv.Atoi(ctx.Param("orderID"))
	if err != nil {
		log.Printf("[GetLastPositionByOrderID]; Error converting order id to int: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order id"})
		return
	}

	orderPositionHistory := mongoModels.OrderPositionHistory{OrderID: orderID}
	err = orderPositionHistory.GetLastPositionByOrderID(ctx, database)
	if err != nil {
		log.Printf("[GetLastPositionByOrderID]; Error getting last position by order id: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting last position by order id"})
		return
	}

	ctx.JSON(http.StatusOK, orderPositionHistory)
}

// CreateOrderPosition godoc
//	@Summary		Create an order position
//	@Description	Create an order position
//	@Tags			OrderPosition
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			orderPositionHistory	body		mongoModels.OrderPositionHistory	true	"Order Position"
//	@Success		200						{object}	string
//	@Failure		400						{object}	string
//	@Failure		500						{object}	string
//	@Router			/ [post]
func CreateOrderPosition(ctx *gin.Context, database *mongo.Database) {
	var orderPositionHistory mongoModels.OrderPositionHistory
	err := ctx.BindJSON(&orderPositionHistory)
	if err != nil {
		log.Printf("[CreateOrderPosition]; Error binding json: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error binding json"})
		return
	}

	err = orderPositionHistory.CreateOrderPosition(ctx, database)
	if err != nil {
		log.Printf("[CreateOrderPosition]; Error creating order position: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating order position"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Order position created"})
}

// CreateOrderPositionLite godoc
//	@Summary		Create an order position with less order position informations
//	@Description	Create an order position with less order position informations, only the order id, and the position are required
//	@Tags			OrderPosition
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			orderPositionHistory	body		mongoModels.OrderPositionHistory	true	"Order Position"
//	@Success		200						{object}	string
//	@Failure		400						{object}	string
//	@Failure		500						{object}	string
//	@Router			/createLite [post]
func CreateOrderPositionLite(ctx *gin.Context, database *mongo.Database) {
	var orderPositionHistory mongoModels.OrderPositionHistory
	err := ctx.BindJSON(&orderPositionHistory)
	if err != nil {
		log.Printf("[CreateOrderPositionLite]; Error binding json: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error binding json"})
		return
	}
	// add missing fields
	orderPositionHistory.DateTime = time.Now()

	err = orderPositionHistory.CreateOrderPosition(ctx, database)
	if err != nil {
		log.Printf("[CreateOrderPositionLite]; Error creating order position: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating order position"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Order position created"})
}

// GetJourneyByOrderID godoc
//	@Summary		Get the journey of an order by its id
//	@Description	Get the journey of an order by its id
//	@Tags			OrderPosition
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			orderID	path		int	true	"Order ID"
//	@Success		200		{object}	[]mongoModels.OrderPositionHistory
//	@Failure		400		{object}	string
//	@Failure		500		{object}	string
//	@Router			/journey/{orderID} [get]
func GetJourneyByOrderID(ctx *gin.Context, database *mongo.Database) {
	orderID, err := strconv.Atoi(ctx.Param("orderID"))
	if err != nil {
		log.Printf("[GetJourneyByOrderID]; Error converting order id to int: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order id"})
		return
	}

	orderPositionHistory := mongoModels.OrderPositionHistory{OrderID: orderID}
	journey, err := orderPositionHistory.GetJourneyByOrderID(ctx, database)
	if err != nil {
		log.Printf("[GetJourneyByOrderID]; Error getting journey by order id: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting journey by order id"})
		return
	}

	ctx.JSON(http.StatusOK, journey)
}

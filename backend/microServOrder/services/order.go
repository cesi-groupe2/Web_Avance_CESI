package orderService

import (
	"log"
	"strconv"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/mongoDBMain/mongoModels"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// GetALLOrder godoc
//
//	@Summary		Get all orders
//	@Description	Get all orders
//	@Tags			order
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			limit	query	int	false	"Limit"
//	@Success		200		{array}	[]mongoModels.Order
//	@Router			/all [get]
func GetAllOrder(ctx *gin.Context, database *mongo.Database) {
	limitStr := ctx.Param("limit")
	if limitStr == "" {
		limitStr = "0"
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid limit parameter"})
		return
	}
	// get all orders
	orders, err := mongoModels.GetAllOrder(ctx, database, limit)
	if err != nil {
		log.Printf("Error getting orders: %v", err)
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Return the orders
	ctx.JSON(200, orders)
}

// GetOrderById godoc
//
//	@Summary		Get order by id
//	@Description	Get order by id
//	@Tags			order
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			orderId	path		string	true	"Order ID"
//	@Success		200		{object}	mongoModels.Order
//	@Router			/{orderId} [get]
func GetOrderById(ctx *gin.Context, database *mongo.Database) {
	orderObjId, err := utils.OrderIdParamToObjId(ctx.Param("orderId"))
	if err != nil {
		log.Printf("Error converting order ID to ObjectID: %v", err)
		ctx.JSON(400, gin.H{"error": "Invalid order ID"})
		return
	}

	order := mongoModels.Order{
		OrderID: orderObjId,
	}
	err = order.GetOrderById(ctx, database)
	if err != nil {
		log.Printf("Error getting order: %v", err)
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Return the order
	ctx.JSON(200, order)
}

// CreateOrder godoc
//
//	@Summary		Create an order
//	@Description	Create an order
//	@Tags			order
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			order	body		mongoModels.Order	true	"Order object"
//	@Success		200		{object}	mongoModels.Order
//	@Router			/ [post]
func CreateOrder(ctx *gin.Context, database *mongo.Database) {
	// get the order from the body
	var order mongoModels.Order
	if err := ctx.BindJSON(&order); err != nil {
		log.Printf("Error binding JSON: %v", err)
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// create the order
	err := order.InsertOrder(ctx, database)
	if err != nil {
		log.Printf("Error creating order: %v", err)
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
}

// UpdateOrder godoc
//
//	@Summary		Update an order
//	@Description	Update an order
//	@Tags			order
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			order	body		mongoModels.Order	true	"Order object"
//	@Success		200		{object}	mongoModels.Order
//	@Router			/ [patch]
func UpdateOrder(ctx *gin.Context, database *mongo.Database) {
	// update an order
	var order mongoModels.Order
	if err := ctx.BindJSON(&order); err != nil {
		log.Printf("Error binding JSON: %v", err)
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	err := order.UpdateOrder(ctx, database)
	if err != nil {
		log.Printf("Error updating order: %v", err)
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Return the order
	ctx.JSON(200, order)
}

// DeleteOrder godoc
//
//	@Summary		Delete an order
//	@Description	Delete an order
//	@Tags			order
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			orderId	path	string	true	"Order ID"
//	@Success		200
//	@Router			/{orderId} [delete]
func DeleteOrder(ctx *gin.Context, database *mongo.Database) {
	// delete an order
	orderObjId, err := utils.OrderIdParamToObjId(ctx.Param("orderId"))
	if err != nil {
		log.Printf("Error converting order ID to ObjectID: %v", err)
		ctx.JSON(400, gin.H{"error": "Invalid order ID"})
		return
	}

	order := mongoModels.Order{
		OrderID: orderObjId,
	}
	err = order.DeleteOrder(ctx, database)
	if err != nil {
		log.Printf("Error deleting order: %v", err)
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Return success
	ctx.JSON(200, "done")
}

// UpdateToNextStatus godoc
//
//	@Summary		Update an order to the next status
//	@Description	Update an order to the next status
//	@Tags			order
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			orderId	path	string	true	"Order ID"
//	@Success		200
//	@Router			/nextStatus/{orderId} [put]
func UpdateToNextStatus(ctx *gin.Context, database *mongo.Database) {
	// update an order to the next status
	orderIdInt, err := utils.OrderIdParamToObjId(ctx.Param("orderId"))
	if err != nil {
		log.Printf("Error converting order ID to ObjectID: %v", err)
		ctx.JSON(400, gin.H{"error": "Invalid order ID"})
		return
	}

	// get the order
	order := mongoModels.Order{
		OrderID: orderIdInt,
	}
	err = order.GetOrderById(ctx, database)
	if err != nil {
		log.Printf("Error getting order: %v", err)
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// update the order to the next status
	order.Status = order.Status.NextStatus()
	err = order.UpdateOrder(ctx, database)
	if err != nil {
		log.Printf("Error updating order: %v", err)
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Return the order
	ctx.JSON(200, order)
}

// GetHistoryOrderByUserId godoc
//
//	@Summary		Get order history by user ID
//	@Description	Get order history by user ID
//	@Tags			order
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			userId	path	string	true	"User ID"
//	@Success		200		{array}	[]mongoModels.Order
//	@Router			/history/{userId} [get]
func GetHistoryOrderByUserId(ctx *gin.Context, database *mongo.Database) {
	userId := ctx.Param("userId")
	userIdInt, err := strconv.Atoi(userId)
	if err != nil {
		log.Printf("Error converting user ID to int: %v", err)
		ctx.JSON(400, gin.H{"error": "Invalid user ID"})
		return
	}

	// get the order
	orders, err := mongoModels.GetOrderByUserId(ctx, database, userIdInt)
	if err != nil {
		log.Printf("Error getting order: %v", err)
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Return the order
	ctx.JSON(200, orders)
}

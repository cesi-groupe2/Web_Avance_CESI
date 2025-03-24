package roads

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/mongoDBMain/mongoModels"

)

func HandleOrdersRoads(ctx context.Context, router *gin.RouterGroup) {
	orders := router.Group("/orders")
	orders.GET("/", )
}

// GetAllOrder godoc
// @Summary Get all orders
// @Accept  json
// @Produce  json
// @Success 200 {object} mongoModels.Order
// @Router /orders [get]
func GetAllOrder(ctx *gin.Context) {
	// request the orders microservice
	httpResponse, err := http.Get("http://localhost:8093/all")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	defer httpResponse.Body.Close()

	body, err := io.ReadAll(httpResponse.Body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	var orders []mongoModels.Order
	if err = json.Unmarshal(body, &orders); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
}
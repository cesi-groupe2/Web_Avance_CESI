package rest
import (
	"context"
	"fmt"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/rest/roads"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
    	ginSwagger "github.com/swaggo/gin-swagger"
    	swaggerFiles "github.com/swaggo/files"
)

func InitServer() {

	// server gin 
	router := gin.Default()

	// enable cors
	router.Use(cors.Default())

	// handle api roads
	roads.HandleApiRoads(context.Background(), router)

	// serve swagger
	router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// run router
	router.Run(fmt.Sprintf("%s:%s",
		utils.GetEnvValueOrDefaultStr(constants.API_GATEWAY_ADDR_ENV, "localhost"),
		utils.GetEnvValueOrDefaultStr(constants.API_GATEWAY_PORT_ENV, "8080")))
}

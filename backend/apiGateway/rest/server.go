package rest

import (
	"context"
	"fmt"
	"log"
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
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// redirect /auth/*any to localhost:8001
	router.Any("/auth/*any", func(c *gin.Context) {
		c.Request.URL.Host = fmt.Sprintf("%s:%s",
			utils.GetEnvValueOrDefaultStr(constants.AUTH_SERVICE_HOST_ENV, "localhost"),
			utils.GetEnvValueOrDefaultStr(constants.AUTH_SERVICE_PORT_ENV, "8001"))
		c.Request.URL.Scheme = "http"
		c.Request.URL.Path = c.Param("any")
		c.Request.RequestURI = c.Request.URL.Path
		c.Request.Header.Set("X-Forwarded-Host", c.Request.Host)
		c.Request.Host = c.Request.URL.Host
		c.Next()
	})

	//  redirect /public/*any to localhost:8001
	router.Any("/public/*any", func(c *gin.Context) {
		c.Redirect(307, fmt.Sprintf("http://%s:%s%s",
			utils.GetEnvValueOrDefaultStr(constants.AUTH_SERVICE_HOST_ENV, "localhost"),
			utils.GetEnvValueOrDefaultStr(constants.AUTH_SERVICE_PORT_ENV, "8001"),
			c.Request.URL.Path,
	))})

	// redirect /restaurant/*any to localhost:8004
	router.Any("/restaurant/*any", func(c *gin.Context) {
		log.Println("Redirecting to", fmt.Sprintf("http://%s:%s%s",
			utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_RESTAURANT_ADDR_ENV, "localhost"),
			utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_RESTAURANT_PORT_ENV, "8004"),
			c.Request.URL.Path,
		))
		c.Redirect(307, fmt.Sprintf("http://%s:%s%s",
			utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_RESTAURANT_ADDR_ENV, "localhost"),
			utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_RESTAURANT_PORT_ENV, "8004"),
			c.Request.URL.Path,
		))
	})
		



	// run router
	err := router.Run(fmt.Sprintf("%s:%s", 
		utils.GetEnvValueOrDefaultStr(constants.API_GATEWAY_ADDR_ENV, "localhost"),
		utils.GetEnvValueOrDefaultStr(constants.API_GATEWAY_PORT_ENV, "8080")))

	// Vérification de l'erreur
	if err != nil {
		log.Fatalf("Failed to start the server: %v", err)
	}
}

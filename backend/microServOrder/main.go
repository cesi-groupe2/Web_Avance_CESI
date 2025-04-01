package main

// command swag init -g order.go -d services,../mongoDBMain

import (
	"log"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	_ "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServOrder/docs"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServOrder/roads"
)

// @title           Swagger Easeat Order microservice API
// @version         2.0
// @description     This is a microservice for managing orders in the Easeat application.

// @contact.name   Groupe 2 FISA INFO A4 CESI (2025)
// @contact.url    https://contact.easeat.fr
// @contact.email  benjamin.guerre@viacesi.fr

// @host      localhost:8093
// @BasePath  /order

// @securityDefinitions.basic  BasicAuth

func main() {
	log.Println("Starting Order microservice")
	microservorder := microservbase.MicroServMongo{}
	microservorder.InitServer()
	microservorder.InitDbClient()
	orderGroup := roads.HandlerMicroServOrderRoads(microservorder.Server, microservorder.Database)
	microservorder.InitSwagger(orderGroup)

	address := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_ORDER_ADDR_ENV, "localhost")
	port := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_ORDER_PORT_ENV, "8002")
	microservorder.RunServer(address, port)
}

package main

// command swag init -g main.go -d ./,services,../mongoDBMain

import (
	"log"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServOrder/docs"
	_ "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServOrder/docs"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServOrder/roads"
)

//	@title			Swagger Easeat Order microservice API
//	@version		2.0
//	@description	This is a microservice for managing orders in the Easeat application.
//	@contact.name	Groupe 2 FISA INFO A4 CESI (2025)
//	@contact.url	https://contact.easeat.fr
//	@contact.email	benjamin.guerre@viacesi.fr
//	@host		localhost:8093
//	@BasePath	/order

//	@SecurityDefinitions.apiKey	BearerAuth
//	@in							header
//	@name						Authorization
//	@description				Use /login to get your token and use it here

func main() {
	log.Println("Starting Order microservice")
	microservorder := microservbase.MicroServMongo{}
	microservorder.InitServer()
	microservorder.InitDbClient()
	orderGroup := roads.HandlerMicroServOrderRoads(microservorder.Server, microservorder.Database)
	
	address := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_ORDER_ADDR_ENV, "localhost")
	portEnv := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_ORDER_PORT_ENV, "8002")
	port, err := utils.GetAvailablePort(portEnv)
	if err != nil {
		panic(err)
	}
	docs.SwaggerInfo.Host = microservorder.InitSwagger(orderGroup, address, port)
	microservorder.RunServer(address, port)
}

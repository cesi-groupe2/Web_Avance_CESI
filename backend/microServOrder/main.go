package main

// command swag init -g order.go -d services,../mongoDBMain

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServOrder/roads"
	_ "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServOrder/docs"
)

// @title           Swagger Easeat Order microservice API
// @version         2.0
// @description     This is a microservice for managing orders in the Easeat application.

// @contact.name   Groupe 2 FISA INFO A4 CESI (2025)
// @contact.url    https://contact.easeat.fr
// @contact.email  benjamin.guerre@viacesi.fr

// @host      localhost:8093
// @BasePath  /api

// @securityDefinitions.basic  BasicAuth

func main() {
	microservorder := microservbase.MicroServMongo{}
	microservorder.InitServer()
	microservorder.InitDbClient()
	roads.HandlerMicroServOrderRoads(microservorder.Server, microservorder.Database)


	address := utils.GetEnvValueOrDefaultStr("ORDER_SERVICE_HOST", "localhost")
	port := utils.GetEnvValueOrDefaultStr("ORDER_SERVICE_PORT", "8093")
	microservorder.RunServer(address, port)
}

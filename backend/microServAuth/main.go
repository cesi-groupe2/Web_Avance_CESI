package main

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	roads "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/routes"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
)

// @title           Swagger Easeat Auth API
// @version         2.0
// @description     This is a microservice for managing authentication
// @contact.name    Groupe 2 FISA INFO A4 CESI (2025)
// @contact.url     https://contact.easeat.fr
// @contact.email  benjamin.guerre@viacesi.fr

// @host      localhost:8000
// @BasePath  /auth

// @securityDefinitions.basic  BasicAuth

func main(){
	microservAuth := microservbase.MicroServMySql{}
	microservAuth.InitServer()
	microservAuth.InitDbClient()

	roads.HandlerMicroServAuthRoads(microservAuth.Server, microservAuth.DbCient)
	address := utils.GetEnvValueOrDefaultStr(constants.AUTH_SERVICE_HOST_ENV, "localhost")
	port := utils.GetEnvValueOrDefaultStr(constants.AUTH_SERVICE_PORT_ENV, "8050")
	microservAuth.RunServer(address, port)
}
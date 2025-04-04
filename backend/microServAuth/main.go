package main

// command: swag init -g main.go -d ./,../sqlDBMain,controllers

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/docs"
	roads "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/routes"
	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase" // swagger embed files
)

//	@title			Swagger Easeat Auth API
//	@version		1.0
//	@description	This is a microservice for managing authentication
//	@contact.name	Groupe 2 FISA INFO A4 CESI (2025)
//	@contact.url	https://contact.easeat.fr
//	@contact.email	benjamin.guerre@viacesi.fr
//	@host			localhost:7001
//	@BasePath		/

//	@SecurityDefinitions.apiKey	BearerAuth
//	@in							header
//	@name						Authorization
//	@description				Use /login to get your token and use it here

func main() {
	microservAuth := microservbase.MicroServMySql{}
	microservAuth.InitServer()
	microservAuth.InitDbClient()

	authGroup := roads.HandlerMicroServAuthRoads(microservAuth.Server, microservAuth.DbCient)

	address := utils.GetEnvValueOrDefaultStr(constants.AUTH_SERVICE_HOST_ENV, "0.0.0.0")
	portEnv := utils.GetEnvValueOrDefaultStr(constants.AUTH_SERVICE_PORT_ENV, "8001")
	port, err := utils.GetAvailablePort(portEnv)
	if err != nil {
		panic(err)
	}
	docs.SwaggerInfo.Host = microservAuth.InitSwagger(authGroup, address, port)
	microservAuth.RunServer(address, port)
}

package main

// command: swag init -g auth.go -d controllers,../sqlDBMain

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	roads "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/routes"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	_ "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/docs"
)

// @title           Swagger Easeat Auth API
// @version         1.0
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

	authGroup := roads.HandlerMicroServAuthRoads(microservAuth.Server, microservAuth.DbCient)
	microservAuth.InitSwagger(authGroup)
	address := utils.GetEnvValueOrDefaultStr(constants.AUTH_SERVICE_HOST_ENV, "0.0.0.0")
	port := utils.GetEnvValueOrDefaultStr(constants.AUTH_SERVICE_PORT_ENV, "8001")
	microservAuth.RunServer(address, port)
}

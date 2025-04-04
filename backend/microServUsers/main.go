package main

// command: swag init -g main.go -d ./,services,../sqlDBMain,../mongoDBMain

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServUsers/roads"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServUsers/docs"
)

//	@title			Swagger Easeat restaurant microservice
//	@version		2.0
//	@description	This is a microservice for managing restaurants

//	@contact.name	Groupe 2 FISA INFO A4 CESI (2025)
//	@contact.url	https://contact.easeat.fr
//	@contact.email	benjamin.guerre@viacesi.fr

//	@host		localhost:8052
//	@BasePath	/users

//	@SecurityDefinitions.apiKey	BearerAuth
//	@in							header
//	@name						Authorization
//	@description				Use /login to get your token and use it here

func main() {
	microServ := microservbase.MicroServMySql{}
	microServ.InitServer()
	microServ.InitDbClient()
	userGroup := roads.HandlerMicroServUsersRoads(microServ.Server, microServ.DbCient)

	address := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_USERS_ADDR_ENV, "localhost")
	portEnv := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_USERS_PORT_ENV, "8005")
	port, err := utils.GetAvailablePort(portEnv)
	if err != nil {
		panic(err)
	}
	docs.SwaggerInfo.Host = microServ.InitSwagger(userGroup, address, port)
	microServ.RunServer(address, port)
}

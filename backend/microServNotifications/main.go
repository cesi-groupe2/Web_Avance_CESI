package main

// command: swag init -g main.go -d ./,services,../sqlDBMain,../mongoDBMain,ws

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServNotifications/roads"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServNotifications/docs"
)

//	@title			Swagger Easeat Notifications microservice
//	@version		1.0
//	@description	This is a microservice for managing notifications

//	@contact.name	Groupe 2 FISA INFO A4 CESI (2025)
//	@contact.url	https://contact.easeat.fr
//	@contact.email	benjamin.guerre@viacesi.fr

//	@host		localhost:8006
//	@BasePath	/notifications

//	@SecurityDefinitions.apiKey	BearerAuth
//	@in							header
//	@name						Authorization
//	@description				Use /login to get your token and use it here

func main() {
	microSerNotif := microservbase.MicroServMongo{}
	microSerNotif.InitServer()
	microSerNotif.InitDbClient()

	roadgroup := roads.SetupRoutes(microSerNotif.Server, microSerNotif.Database)

	address := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_NOTIFICATIONS_ADDR_ENV, "localhost")
	portEnv := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_NOTIFICATIONS_PORT_ENV, "8006")
	port, err := utils.GetAvailablePort(portEnv)
	if err != nil {
		panic(err)
	}
	docs.SwaggerInfo.Host = microSerNotif.InitSwagger(roadgroup, address, port)
	microSerNotif.Server.Run(address + ":" + port)
}

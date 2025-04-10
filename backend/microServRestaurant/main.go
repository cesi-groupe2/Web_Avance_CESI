package main

// command: swag init -g main.go -d ./,services,../sqlDBMain,../mongoDBMain

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microservrestaurant/docs"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microservrestaurant/roads"
)

//	@title			Swagger Easeat restaurant microservice
//	@version		2.0
//	@description	This is a microservice for managing restaurants

//	@contact.name	Groupe 2 FISA INFO A4 CESI (2025)
//	@contact.url	https://contact.easeat.fr
//	@contact.email	benjamin.guerre@viacesi.fr

//	@host		localhost:8052
//	@BasePath	/

//	@SecurityDefinitions.apiKey	BearerAuth
//	@in							header
//	@name						Authorization
//	@description				Use /login to get your token and use it here

func main() {
	microservrestaurant := microservbase.MicroServMySql{}
	microservrestaurant.InitServer()
	microservrestaurant.InitDbClient()
	restaurantGroup := roads.HandlerMicroServRestaurantRoads(microservrestaurant.Server, microservrestaurant.DbCient)

	address := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_RESTAURANT_ADDR_ENV, "localhost")
	portEnv := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_RESTAURANT_PORT_ENV, "8004")
	port, err := utils.GetAvailablePort(portEnv)
	if err != nil {
		panic(err)
	}
	docs.SwaggerInfo.Host = microservrestaurant.InitSwagger(restaurantGroup, address, port)
	microservrestaurant.RunServer(address, port)
}

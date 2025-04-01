package main

// command: swag init -g restaurantService.go -d services,../sqlDBMain

import (
	"microservrestaurant/roads"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	// _ "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServRestaurant/docs"
)

// @title           Swagger Easeat restaurant microservice
// @version         2.0
// @description     This is a microservice for managing restaurants
	
// @contact.name   Groupe 2 FISA INFO A4 CESI (2025)
// @contact.url    https://contact.easeat.fr
// @contact.email  benjamin.guerre@viacesi.fr

// @host      localhost:8052
// @BasePath  /

// @securityDefinitions.basic  BasicAuth


func main() {
	microservrestaurant := microservbase.MicroServMySql{}
	microservrestaurant.InitServer()
	microservrestaurant.InitDbClient()
	roads.HandlerMicroServRestaurantRoads(microservrestaurant.Server, microservrestaurant.DbCient)

	microservrestaurant.RunServer(
		utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_RESTAURANT_ADDR_ENV, "localhost"), 
		utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_RESTAURANT_PORT_ENV, "8004"))
}

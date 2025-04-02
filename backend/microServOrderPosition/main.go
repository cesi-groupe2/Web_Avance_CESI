package main

// command swag init -g main.go -d ./,services,../mongoDBMain

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	_ "github.com/cesi-groupe2/Web_Avance_CESI/backend/microSerOrderPosition/docs"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microSerOrderPosition/roads"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
)

// @title           Swagger Easeat Order position API
// @version         2.0
// @description     This is a microservice for managing orders positions

// @contact.name   Groupe 2 FISA INFO A4 CESI (2025)
// @contact.url    https://contact.easeat.fr
// @contact.email  benjamin.guerre@viacesi.fr

// @host      localhost:8020
// @BasePath  /orderPosition

// @SecurityDefinitions.apiKey BearerAuth
// @in              header
// @name            Authorization
// @description     Use /login to get your token and use it here

func main(){
	microServBase := microservbase.MicroServMongo{}
	microServBase.InitServer()
	microServBase.InitDbClient()
	orderPositionGroup := roads.HandlerMicroServOrderPositionRoads(microServBase.Server, microServBase.Database)
	microServBase.InitSwagger(orderPositionGroup)
	address := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_ORDER_POSITIONS_ADDR_ENV, "localhost")
	port := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_ORDER_POSITIONS_PORT_ENV, "8003")
	microServBase.RunServer(address, port)
}

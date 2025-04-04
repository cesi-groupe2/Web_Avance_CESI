package main

// command swag init -g orderPositionService.go -d services,../mongoDBMain

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	_ "github.com/cesi-groupe2/Web_Avance_CESI/backend/microSerOrderPosition/docs"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microSerOrderPosition/roads"
	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
)

// @title           Swagger Easeat Order position API
// @version         2.0
// @description     This is a microservice for managing orders positions

// @contact.name   Groupe 2 FISA INFO A4 CESI (2025)
// @contact.url    https://contact.easeat.fr
// @contact.email  benjamin.guerre@viacesi.fr

// @host      localhost:8020
// @BasePath  /

// @securityDefinitions.basic  BasicAuth
func main() {
	microServBase := microservbase.MicroServMongo{}
	microServBase.InitServer()
	microServBase.InitDbClient()
	roads.HandlerMicroServOrderPositionRoads(microServBase.Server, microServBase.Database)

	address := utils.GetEnvValueOrDefaultStr("ORDER_POSITION_SERVICE_HOST", "localhost")
	port := utils.GetEnvValueOrDefaultStr("ORDER_POSITION_SERVICE_PORT", "8020")
	microServBase.RunServer(address, port)
}

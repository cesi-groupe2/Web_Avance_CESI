package main

// command swag init -g orderPositionService.go -d services,../mongoDBMain

import (
	roads "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/roads"
	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
)

// @title           Swagger Easeat Order position API
// @version         2.0
// @description     This is a microservice for managing users

// @contact.name   Groupe 2 FISA INFO A4 CESI (2025)
// @contact.url    https://contact.easeat.fr
// @contact.email  benjamin.guerre@viacesi.fr

// @host      localhost:8030
// @BasePath  /

// @securityDefinitions.basic  BasicAuth
func main() {
	microServBase := microservbase.MicroServSqlServer{}
	microServBase.InitServer()
	microServBase.InitDbClient()

	roads.HandleUserRoads(microServBase.Server, microServBase.Client)
	microServBase.RunServer("localhost", "8030")
}

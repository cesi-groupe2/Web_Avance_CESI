package main

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
)

func main() {
	microServ := microservbase.MicroServMySql{}
	microServ.InitServer()
	// microServ.InitDbClient()
	// roads.HandlerMicroServUsersRoads(microServ.Server, microServ.MongoDB)
	portEnv := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_USERS_PORT_ENV, "8081")
	port, err := utils.GetAvailablePort(portEnv)
	if err != nil {
		panic(err)
	}
	microServ.RunServer(utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_USERS_ADDR_ENV, "localhost"), port)
}

package main

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServUsers/roads"
)


func main(){
	microServ := microservbase.Microserv{}
	microServ.InitServer(microservbase.UserMicroserv)
	roads.HandlerMicroServUsersRoads(microServ.Server)
	portEnv := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_USERS_PORT_ENV, "8081")
	port, err := utils.GetAvailablePort(portEnv)
	if err != nil {
		panic(err)
	}
	microServ.RunServer(utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_USERS_ADDR_ENV, "localhost"), port)
}


package microservbase

import "github.com/gin-gonic/gin"

type Microserv struct {
	Server *gin.Engine
	TypeDb string // DB can be mongodb or sqlserver
	Db     interface{} // DB connection
	MicroServType MicroserviceType
}

func (m *Microserv) InitServer(microsServType MicroserviceType) {
	// init server
	m.Server = gin.Default()

	// set microservice type
	m.MicroServType = microsServType
}

func (m *Microserv) RunServer(addr string, port string) {
	// run router
	m.Server.Run(addr + ":" + port)
}



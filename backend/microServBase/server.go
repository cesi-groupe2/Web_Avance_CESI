package microservbase

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/gin-gonic/gin"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type Microserv struct {
	Server        *gin.Engine
	MongoDB       *mongo.Client // DB connection
	SQLDB         interface{}   // SQL DB connection
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

func (m *Microserv) InitMongoDBConnection() {
	// init mongodb connection
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	username := utils.GetEnvValueOrDefaultStr(constants.MONGO_INITDB_ROOT_USERNAME, "root")
	password := utils.GetEnvValueOrDefaultStr(constants.MONGO_INITDB_ROOT_PASSWORD, "root")

	var err error
	m.MongoDB, err = mongo.Connect(
		ctx,
		options.Client().ApplyURI("mongodb://"+username+":"+password+"@localhost:27017/"),
	)

	defer func() {
		cancel()
		if err := m.MongoDB.Disconnect(ctx); err != nil {
			log.Fatalf("mongodb disconnect error : %v", err)
		}
	}()

	if err != nil {
		log.Fatalf("connection error :%v", err)
		return
	}

	err = m.MongoDB.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatalf("ping mongodb error :%v", err)
		return
	}
	fmt.Println("ping success")

}

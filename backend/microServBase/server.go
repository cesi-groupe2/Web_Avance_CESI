package microservbase

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
	// _ "github.com/denisenkom/go-mssqldb"
)

type MicroServ interface {
	InitServer()
	RunServer(addr, port string)
	InitDbClient()
}

type MicroServMongo struct {
	Server   *gin.Engine
	DbClient *mongo.Client
	Database *mongo.Database
}

type MicroServSqlServer struct {
	Server *gin.Engine
	client *sql.DB
}

//////////////////////
// MongoDB methods  //
//////////////////////

func (m *MicroServMongo) InitServer() {
	m.Server = gin.Default()

	// add swagger route
	m.Server.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
}

func (m *MicroServMongo) RunServer(addr, port string) {
	m.Server.Run(addr + ":" + port)
}

func (m *MicroServMongo) InitDbClient() {
	// Connection to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	username := utils.GetEnvValueOrDefaultStr(constants.MONGO_INITDB_ROOT_USERNAME, "root")
	password := utils.GetEnvValueOrDefaultStr(constants.MONGO_INITDB_ROOT_PASSWORD, "root")
	host := utils.GetEnvValueOrDefaultStr(constants.MONGO_HOST_ENV, "localhost")
	port := utils.GetEnvValueOrDefaultStr(constants.MONGO_PORT_ENV, "27017")

	uri := fmt.Sprintf("mongodb://%s:%s@%s:%s", username, password, host, port)

	var err error
	m.DbClient, err = mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("Connection MongoDB error: %v", err)
	}

	// check connection
	err = m.DbClient.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatalf("Ping MongoDB error: %v", err)
	}

	// Set database
	m.Database = m.DbClient.Database(constants.MONGO_DATABASE)
	
	fmt.Printf("Connecté à MongoDB (%s:%s; database: %s) avec succès!\n", host, port, constants.MONGO_DATABASE)
}

//////////////////////////////
// SQL Server methods       //
//////////////////////////////

func (s *MicroServSqlServer) InitServer() {
	s.Server = gin.Default()
}

func (s *MicroServSqlServer) RunServer(addr, port string) {
	s.Server.Run(addr + ":" + port)
}

// func (s *MicroServSqlServer) InitDbClient() {
// 	// Récupérer les valeurs de connexion depuis les variables d'environnement ou constantes
// 	server := utils.GetEnvValueOrDefaultStr(constants.SQL_SERVER_HOST, "localhost")
// 	port := utils.GetEnvValueOrDefaultStr(constants.SQL_SERVER_PORT, "1433")
// 	user := utils.GetEnvValueOrDefaultStr(constants.SQL_SERVER_USER, "sa")
// 	password := utils.GetEnvValueOrDefaultStr(constants.SQL_SERVER_PASSWORD, "yourStrong(!)Password")
// 	database := utils.GetEnvValueOrDefaultStr(constants.SQL_SERVER_DB, "master")

// 	// Exemple de chaîne de connexion pour SQL Server
// 	connString := fmt.Sprintf("server=%s;port=%s;user id=%s;password=%s;database=%s", server, port, user, password, database)

// 	var err error
// 	s.DB, err = sql.Open("sqlserver", connString)
// 	if err != nil {
// 		log.Fatalf("Connection SQL Server error: %v", err)
// 	}

// 	// Context avec timeout pour la vérification
// 	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
// 	defer cancel()

// 	err = s.DB.PingContext(ctx)
// 	if err != nil {
// 		log.Fatalf("Ping SQL Server error: %v", err)
// 	}
// 	fmt.Println("Connecté à SQL Server avec succès!")
// }

package microservbase

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

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

type MicroServMySql struct {
	Server *gin.Engine
	DbCient *gorm.DB
}

//////////////////////
// MongoDB methods  //
//////////////////////

func (m *MicroServMongo) InitServer() {
	m.Server = gin.Default()

	// add swagger route
	m.Server.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	m.Server.GET("/docs", func(ctx *gin.Context) {
		ctx.Redirect(301, "/swagger/index.html")
	})
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
// Mysql methods       //
//////////////////////////////

func (m *MicroServMySql) InitServer() {
	m.Server = gin.Default()
		// add swagger route
	m.Server.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	m.Server.GET("/docs", func(ctx *gin.Context) {
		ctx.Redirect(301, "/swagger/index.html")
	})
}

func (s *MicroServMySql) RunServer(addr, port string) {
	s.Server.Run(addr + ":" + port)
}

func (s *MicroServMySql) InitDbClient() {
	// Connection to MySQL
	username := utils.GetEnvValueOrDefaultStr(constants.MYSQL_USER_ENV, "root")
	password := utils.GetEnvValueOrDefaultStr(constants.MYSQL_PASSWORD_ENV, "rootpassword")
	dbAddress := utils.GetEnvValueOrDefaultStr(constants.MYSQL_ADDRESS_ENV, "localhost")
	dbPort := utils.GetEnvValueOrDefaultStr(constants.MYSQL_PORT_ENV, "3306")
	database := utils.GetEnvValueOrDefaultStr(constants.MYSQL_DATABASE, "easeat")

	var err error
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", username, password, dbAddress, dbPort, database)
	s.DbCient, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Connection MySQL error: %v", err)
	}

	defer func() {
		sqlDB, err := s.DbCient.DB()
		if err != nil {
			log.Fatalf("Get MySQL DB error: %v", err)
		}
		sqlDB.Close()
	}()

	fmt.Printf("Connected to MySQL (%s:%s; database: %s) successfully!\n", dbAddress, dbPort, database)
}


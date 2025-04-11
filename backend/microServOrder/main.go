package main

// command swag init -g main.go -d ./,services,../mongoDBMain

import (
	"log"
	"os"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServOrder/docs"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServOrder/roads"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

//	@title			Swagger Easeat Order microservice API
//	@version		2.0
//	@description	This is a microservice for managing orders in the Easeat application.
//	@contact.name	Groupe 2 FISA INFO A4 CESI (2025)
//	@contact.url	https://contact.easeat.fr
//	@contact.email	benjamin.guerre@viacesi.fr
//	@host		localhost:8093
//	@BasePath	/order

//	@SecurityDefinitions.apiKey	BearerAuth
//	@in							header
//	@name						Authorization
//	@description				Use /login to get your token and use it here

func main() {
	// Charger les variables d'environnement
	if err := godotenv.Load("../.env"); err != nil {
		log.Printf("Erreur lors du chargement du fichier .env: %v", err)
	}

	// Vérifier la clé JWT
	jwtKey := os.Getenv(constants.ACCESS_JWT_KEY_ENV)
	if jwtKey == "" {
		log.Fatal("ACCESS_JWT_KEY est vide ou non défini")
	}
	log.Printf("Clé JWT chargée: %s", jwtKey)

	log.Println("Starting Order microservice")
	microservorder := microservbase.MicroServMongo{}
	microservorder.InitServer()
	microservorder.InitDbClient()

	// Configuration CORS
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Content-Length"},
		MaxAge:           12 * 60 * 60, // 12 heures
	}

	log.Println("=== CORS Configuration ===")
	log.Printf("AllowOrigins: %v", corsConfig.AllowOrigins)
	log.Printf("AllowMethods: %v", corsConfig.AllowMethods)
	log.Printf("AllowHeaders: %v", corsConfig.AllowHeaders)
	log.Printf("AllowCredentials: %v", corsConfig.AllowCredentials)
	log.Printf("ExposeHeaders: %v", corsConfig.ExposeHeaders)
	log.Printf("MaxAge: %d", corsConfig.MaxAge)
	log.Println("=========================")

	// Appliquer la configuration CORS
	microservorder.Server.Use(cors.New(corsConfig))

	// Middleware CORS personnalisé pour le logging
	microservorder.Server.Use(func(c *gin.Context) {
		log.Println("\n=== New Request ===")
		log.Printf("Request URL: %s %s", c.Request.Method, c.Request.URL.String())
		log.Printf("Request Origin: %s", c.Request.Header.Get("Origin"))
		log.Printf("Request Method: %s", c.Request.Method)
		log.Printf("Request Headers: %v", c.Request.Header)

		// Gérer les requêtes OPTIONS
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()

		// Log des en-têtes de réponse après le traitement
		log.Println("\n=== Response Headers ===")
		log.Printf("Access-Control-Allow-Origin: %s", c.Writer.Header().Get("Access-Control-Allow-Origin"))
		log.Printf("Access-Control-Allow-Methods: %s", c.Writer.Header().Get("Access-Control-Allow-Methods"))
		log.Printf("Access-Control-Allow-Headers: %s", c.Writer.Header().Get("Access-Control-Allow-Headers"))
		log.Printf("Access-Control-Allow-Credentials: %s", c.Writer.Header().Get("Access-Control-Allow-Credentials"))
		log.Printf("All Response Headers: %v", c.Writer.Header())
		log.Println("=====================")

		log.Printf("\nResponse Status: %d", c.Writer.Status())
		log.Println("=== End Request ===\n")
	})

	// Middleware pour logger les requêtes
	microservorder.Server.Use(func(c *gin.Context) {
		log.Printf("Incoming request: %s %s", c.Request.Method, c.Request.URL.Path)
		c.Next()
	})

	// Ajouter le middleware d'authentification après CORS mais avant les routes
	microservorder.Server.Use(middlewares.AuthMiddleware())

	orderGroup := roads.HandlerMicroServOrderRoads(microservorder.Server, microservorder.Database)

	address := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_ORDER_ADDR_ENV, "localhost")
	portEnv := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_ORDER_PORT_ENV, "8002")
	port, err := utils.GetAvailablePort(portEnv)
	if err != nil {
		panic(err)
	}
	docs.SwaggerInfo.Host = microservorder.InitSwagger(orderGroup, address, port)
	microservorder.RunServer(address, port)
}

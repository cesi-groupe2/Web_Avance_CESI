package main

// command swag fmt
// command: swag init -g main.go -d ./,services,../mongoDBMain
import (
	"log"
	"os"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares"
	routes "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServPayment/routes"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServPayment/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

//	@title			Swagger Easeat Payment API
//	@version		2.0
//	@description	This is a microservice for managing payments

//	@contact.name	Groupe 2 FISA INFO A4 CESI (2025)
//	@contact.url	https://contact.easeat.fr
//	@contact.email	benjamin.guerre@viacesi.fr

//	@host		localhost:8020
//	@BasePath	/payment

//	@SecurityDefinitions.apiKey	BearerAuth
//	@in							header
//	@name						Authorization
//	@description				Use /login to get your token and use it here

func main() {
	// Initialiser Stripe avec la clé secrète
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Erreur: Impossible de charger le fichier .env")
	}
	stripeKey := os.Getenv("STRIPE_SECRET_KEY")
	if stripeKey == "" {
		log.Fatal("STRIPE_SECRET_KEY est vide ou non défini.")
	}
	jwtKey := os.Getenv(constants.ACCESS_JWT_KEY_ENV)
	if jwtKey == "" {
		log.Fatal("ACCESS_JWT_KEY est vide ou non défini.")
	}
	services.InitStripe()
	microServBase := microservbase.MicroServMongo{}
	microServBase.InitServer()
	microServBase.InitDbClient()

	// Configuration CORS
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Content-Length"},
		MaxAge:           12 * 60 * 60, // 12 heures
	}

	// Appliquer la configuration CORS
	microServBase.Server.Use(cors.New(corsConfig))

	// Middleware pour logger les requêtes
	microServBase.Server.Use(func(c *gin.Context) {
		log.Printf("Incoming request: %s %s", c.Request.Method, c.Request.URL.Path)
		log.Printf("Request Headers: %v", c.Request.Header)
		c.Next()
		log.Printf("Response Status: %d", c.Writer.Status())
	})

	// Ajouter le middleware d'authentification
	microServBase.Server.Use(middlewares.AuthMiddleware())

	// Initialiser le groupe de routes pour le paiement
	paymentGroup := routes.HandlerMicroServPaymentRoads(microServBase.Server, microServBase.Database)

	// Définir l'adresse et le port du microservice
	address := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_PAYMENT_ADDR_ENV, "localhost")
	port := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_PAYMENT_PORT_ENV, "8006")

	// Correction ici : utiliser paymentGroup pour InitSwagger()
	microServBase.InitSwagger(paymentGroup, address, port)

	// Démarrer le serveur
	microServBase.RunServer(address, port)
}

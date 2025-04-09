package main

// command swag fmt
// command: swag init -g main.go -d ./,services,../mongoDBMain
import (
	"log"
	"os"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"

	microservbase "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase"
	routes "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServPayment/routes"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServPayment/services"
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
	services.InitStripe()
	microServBase := microservbase.MicroServMongo{}
	microServBase.InitServer()
	microServBase.InitDbClient()

	// Initialiser le groupe de routes pour le paiement
	paymentGroup := routes.HandlerMicroServPaymentRoads(microServBase.Server, microServBase.Database)

	// Correction ici : utiliser paymentGroup pour InitSwagger()
	microServBase.InitSwagger(paymentGroup)

	// Définir l'adresse et le port du microservice
	address := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_PAYMENT_ADDR_ENV, "localhost")
	port := utils.GetEnvValueOrDefaultStr(constants.MICRO_SERV_PAYMENT_PORT_ENV, "8006")

	// Démarrer le serveur
	microServBase.RunServer(address, port)
}

package main

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/rest"
)

// @title           Swagger Easeat API
// @version         2.0
// @description     This is the API for application Easeat. It's for commande food in the restaurant.

// @contact.name   Groupe 2 FISA INFO A4 CESI (2025)
// @contact.url    https://contact.easeat.fr
// @contact.email  benjamin.guerre@viacesi.fr

// @host      localhost:8080
// @BasePath  /api

// @securityDefinitions.basic  BasicAuth

func main() {
	// Initialiser le serveur API Gateway
	rest.InitServer()
}

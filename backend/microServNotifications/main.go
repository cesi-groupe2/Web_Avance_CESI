package main

// command: swag init -g main.go -d ./,services,../mongoDBMain

import (
	"context"
	"log"
	"os"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServNotifications/roads"
	// "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServNotifications/docs"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// @title           Swagger Easeat Notifications microservice
// @version         1.0
// @description     This is a microservice for managing notifications

// @contact.name   Groupe 2 FISA INFO A4 CESI (2025)
// @contact.url    https://contact.easeat.fr
// @contact.email  benjamin.guerre@viacesi.fr

// @host      localhost:8006
// @BasePath  /notifications

// @SecurityDefinitions.apiKey BearerAuth
// @in              header
// @name            Authorization
// @description     Use /login to get your token and use it here

func main() {
	// Charger les variables d'environnement
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Connexion à MongoDB
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(os.Getenv("MONGODB_URI")))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	// Vérifier la connexion
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("notifications_db")

	// Configuration de Gin
	r := gin.Default()

	// Configuration des routes
	roads.SetupRoutes(r, db)

	// Démarrer le serveur
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	r.Run(":" + port)
}

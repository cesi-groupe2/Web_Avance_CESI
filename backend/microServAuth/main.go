package main

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/database"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	database.InitDB()

	router := gin.Default()

	auth := router.Group("/auth")
	{
		auth.POST("/login", handlers.Login)
	}

	router.Run(":8080")
}

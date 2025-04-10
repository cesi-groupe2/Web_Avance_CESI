package roads

import (
	payCommandService "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServPayment/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares"
)

// HandlerMicroServPaymentRoads configure les routes pour le microservice de paiement.
//
//	@Summary		Configure les routes du service de paiement
//	@Description	Définit les endpoints accessibles sous "/payment".
//	@Tags			Payment
//	@Router			/payment/ [post]
func HandlerMicroServPaymentRoads(server *gin.Engine, database *mongo.Database) *gin.RouterGroup {
	payCommand := server.Group("/payment", middlewares.AuthMiddleware())
	// payCommand := server.Group("/payment") // Désactive l'authentification (juste pour tester)

	// Endpoint pour créer un paiement
	payCommand.POST("/", func(ctx *gin.Context) {
		payCommandService.CreatePayment(ctx, database)
	})


	return payCommand
}

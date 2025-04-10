package services

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/paymentintent"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// PaymentRequest représente la requête de paiement JSON
type PaymentRequest struct {
	OrderID string  `json:"order_id" binding:"required"`
	Amount  float64 `json:"amount" binding:"required,gt=0"`
}

// InitStripe initialise Stripe avec la clé secrète
func InitStripe() {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
}

// CreatePayment gère la requête HTTP pour effectuer un paiement avec Stripe
// CreatePayment godoc
// @
func CreatePayment(ctx *gin.Context, database *mongo.Database) {
	var request PaymentRequest

	// Vérification du JSON reçu
	if err := ctx.ShouldBindJSON(&request); err != nil {
		log.Println("JSON invzlid", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format or missing fields"})
		return
	}

	// Créer le paiement Stripe
	paymentIntent, err := processPaymentWithStripe(request.OrderID, request.Amount)
	if err != nil {
		log.Println("Error creattion stripe conf:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Enregistrer la transaction dans MongoDB
	err = savePaymentToDB(ctx, database, request.OrderID, request.Amount, paymentIntent.ID)
	if err != nil {
		log.Println("Impossible to save transactin: ", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save payment"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":       "Payment successful",
		"paymentIntent": paymentIntent.ID,
		"client_secret": paymentIntent.ClientSecret, // Utile pour le frontend
	})
}

// processPaymentWithStripe crée un PaymentIntent avec Stripe
func processPaymentWithStripe(orderID string, amount float64) (*stripe.PaymentIntent, error) {
	if orderID == "" || amount <= 0 {
		return nil, errors.New("invalid payment data")
	}

	// Convertir le montant en cents (Stripe utilise des entiers)
	amountInCents := int64(amount * 100)

	// Créer le paiement avec Stripe
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(amountInCents),
		Currency: stripe.String("eur"),
	}
	paymentIntent, err := paymentintent.New(params)
	if err != nil {
		return nil, fmt.Errorf("Stripe payment failed: %v", err)
	}

	fmt.Printf("PaymentIntent created: %s\n", paymentIntent.ID)
	return paymentIntent, nil
}

// savePaymentToDB enregistre la transaction dans MongoDB
func savePaymentToDB(ctx *gin.Context, database *mongo.Database, orderID string, amount float64, paymentIntentID string) error {
	collection := database.Collection("payments")

	userID := ctx.GetString("user_id") // Récupéré via ton middleware

	_, err := collection.InsertOne(ctx, map[string]interface{}{
		"order_id":      orderID,
		"amount":        amount,
		"status":        "paid",
		"paymentIntent": paymentIntentID,
		"paid_by":       userID,
		"created_at":    time.Now(),
	})
	if err != nil {
		return fmt.Errorf("failed to save payment: %v", err)
	}
	return nil
}


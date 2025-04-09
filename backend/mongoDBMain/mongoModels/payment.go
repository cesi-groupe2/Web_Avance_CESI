package mongoModels

import (
	"fmt"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Payment struct {
	PaymentID bson.ObjectID `bson:"_id" json:"_id"`
	Amount  float32       `bson:"command_amount_id" json:"command_amount_id"`
	Status  PaymentStatus   `bson:"status" json:"status"`
}

func (payment *Payment) GetPaymentById(ctx *gin.Context, database *mongo.Database) error {
	// get payment by id
	filter := bson.D{{Key: "_id", Value: payment.PaymentID}}
	err := database.Collection(constants.MONGO_PAYMENTS_COLLECTION).FindOne(ctx, filter).Decode(&payment)
	if err != nil {
		err = fmt.Errorf("[GetPAYMENTById]; Error getting payment: %v", err)
		return err
	}
	return nil
}

func (payment *Payment) InsertPayment(ctx *gin.Context, database *mongo.Database) error {
	// create payment
	_, err := database.Collection(constants.MONGO_PAYMENTS_COLLECTION).InsertOne(ctx, payment)
	if err != nil {
		err = fmt.Errorf("Error creating payment: %v", err)
		return err
	}
	return nil
}

func (payment *Payment) UpdatePayment(ctx *gin.Context, database *mongo.Database) error {
	// update payment
	filter := bson.D{{Key: "_id", Value: payment.PaymentID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "status", Value: payment.Status}}}}
	_, err := database.Collection(constants.MONGO_PAYMENTS_COLLECTION).UpdateOne(ctx, filter, update)
	if err != nil {
		err = fmt.Errorf("Error updating payment: %v", err)
		return err
	}
	return nil
}

func (payment *Payment) DeletePayment(ctx *gin.Context, database *mongo.Database) error {
	// delete payment
	filter := bson.D{{Key: "_id", Value: payment.PaymentID}}
	_, err := database.Collection(constants.MONGO_PAYMENTS_COLLECTION).DeleteOne(ctx, filter)
	if err != nil {
		err = fmt.Errorf("Error deleting payment: %v", err)
		return err
	}
	return nil
}

func GetAllPayment(ctx *gin.Context, database *mongo.Database, limit int) ([]Payment, error) {
	// get all payments
	opts := options.Find().SetLimit(int64(limit))
	cursor, err := database.Collection(constants.MONGO_PAYMENTS_COLLECTION).Find(ctx, bson.D{}, opts)
	if err != nil {
		err = fmt.Errorf("Error finding documents: %v", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	// Iterate over documents
	var payments []Payment
	for cursor.Next(ctx) {
		var payment Payment
		if err := cursor.Decode(&payment); err != nil {
			err = fmt.Errorf("Error decoding document: %v", err)
			return nil, err
		}
		payments = append(payments, payment)
	}

	// Return the payments
	return payments, nil
}

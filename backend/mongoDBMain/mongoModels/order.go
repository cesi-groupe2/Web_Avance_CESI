package mongoModels

import (
	"fmt"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Order struct {
	OrderID bson.ObjectID `bson:"_id" json:"_id"`
	DeliveryPersonId int `bson:"delivery_person_id" json:"delivery_person_id"`
	CustomerId int `bson:"customer_id" json:"customer_id"`
	RestaurantId int `bson:"restaurant_id" json:"restaurant_id"`
	items []interface{} `bson:"items" json:"items"`
	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	DeliveryAt time.Time `bson:"delivery_at" json:"delivery_at"`
	Status OrderStatus `bson:"status" json:"status"`
}


func (order *Order) GetOrderById(ctx *gin.Context, database *mongo.Database) error {
	// get order by id
	filter := bson.D{{Key: "_id", Value: order.OrderID}}
	err := database.Collection(constants.MONGO_ORDERS_COLLECTION).FindOne(ctx, filter).Decode(&order)
	if err != nil {
		err = fmt.Errorf("[GetOrderById]; Error getting order: %v", err)
		return err
	}
	return nil
}

func (order *Order) InsertOrder(ctx *gin.Context, database *mongo.Database) error {
	// create order
	_, err := database.Collection(constants.MONGO_ORDERS_COLLECTION).InsertOne(ctx, order)
	if err != nil {
		err = fmt.Errorf("Error creating order: %v", err)
		return err
	}
	return nil
}

func (order *Order) UpdateOrder(ctx *gin.Context, database *mongo.Database) error {
	// update order
	filter := bson.D{{Key: "_id", Value: order.OrderID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "status", Value: order.Status}}}}
	_, err := database.Collection(constants.MONGO_ORDERS_COLLECTION).UpdateOne(ctx, filter, update)
	if err != nil {
		err = fmt.Errorf("Error updating order: %v", err)
		return err
	}
	return nil
}

func (order *Order) DeleteOrder(ctx *gin.Context, database *mongo.Database) error {
	// delete order
	filter := bson.D{{Key: "_id", Value: order.OrderID}}
	_, err := database.Collection(constants.MONGO_ORDERS_COLLECTION).DeleteOne(ctx, filter)
	if err != nil {
		err = fmt.Errorf("Error deleting order: %v", err)
		return err
	}
	return nil
}

func GetAllOrder(ctx *gin.Context, database *mongo.Database, limit int) ([]Order, error) {
	// get all orders
	opts := options.Find().SetLimit(int64(limit))
	cursor, err := database.Collection(constants.MONGO_ORDERS_COLLECTION).Find(ctx, bson.D{}, opts)
	if err != nil {
		err = fmt.Errorf("Error finding documents: %v", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	// Iterate over documents
	var orders []Order
	for cursor.Next(ctx) {
		var order Order
		if err := cursor.Decode(&order); err != nil {
			err = fmt.Errorf("Error decoding document: %v", err)
			return nil, err
		}
		orders = append(orders, order)
	}

	// Return the orders
	return orders, nil
}


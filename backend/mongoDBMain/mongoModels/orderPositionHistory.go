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

type OrderPositionHistory struct {
	ID bson.ObjectID `bson:"_id" json:"id"`
	OrderID int `bson:"order_id" json:"order_id"`
	DateTime time.Time `bson:"datetime" json:"datetime"`
	Position string `bson:"position" json:"position"`
}

// Get the last position of an order by its id
func (ordPHist *OrderPositionHistory) GetLastPositionByOrderID(ctx *gin.Context, database *mongo.Database) error {
	collection := database.Collection(constants.MONGO_ORDERS_POSITIONS_HISTORIES_COLLECTION)
	err := collection.FindOne(
		ctx,
		bson.M{"order_id": ordPHist.OrderID},
		options.FindOne().SetSort(bson.M{"datetime": -1}),
	).Decode(ordPHist)
	if err != nil {
		err = fmt.Errorf("[GetLastPositionByOrderID]; Error getting last position by order id: %v", err)
		return err
	}
	return nil
}

func (ordPHist OrderPositionHistory) CreateOrderPosition(ctx *gin.Context, database *mongo.Database) error {
	// generate a new ObjectID
	ordPHist.ID = bson.NewObjectID()
	collection := database.Collection(constants.MONGO_ORDERS_POSITIONS_HISTORIES_COLLECTION)
	_, err := collection.InsertOne(ctx, ordPHist)
	if err != nil {
		err = fmt.Errorf("[CreateOrderPosition]; Error creating order position: %v", err)
		return err
	}
	return nil
}

func (ordPHist OrderPositionHistory) GetJourneyByOrderID(ctx *gin.Context, database *mongo.Database) ([]OrderPositionHistory, error) {
	collection := database.Collection(constants.MONGO_ORDERS_POSITIONS_HISTORIES_COLLECTION)
	cursor, err := collection.Find(ctx, bson.M{"order_id": ordPHist.OrderID}, options.Find().SetSort(bson.M{"datetime": 1}))
	if err != nil {
		err = fmt.Errorf("[GetJourneyByOrderID]; Error getting journey by order id: %v", err)
		return nil, err
	}
	var journey []OrderPositionHistory
	if err = cursor.All(ctx, &journey); err != nil {
		err = fmt.Errorf("[GetJourneyByOrderID]; Error getting journey by order id: %v", err)
		return nil, err
	}
	return journey, nil
}



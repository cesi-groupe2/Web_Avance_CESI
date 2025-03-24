package utils

import (
	"log"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// orderIdParamToObjId converts an order ID string to a bson.ObjectID, or returns an error
func OrderIdParamToObjId(orderId string) (bson.ObjectID, error) {
	orderObjId, err := bson.ObjectIDFromHex(orderId)
	if err != nil {
		log.Printf("Error converting order ID to ObjectID: %v", err)
		return bson.ObjectID{}, err
	}
	return orderObjId, nil
}


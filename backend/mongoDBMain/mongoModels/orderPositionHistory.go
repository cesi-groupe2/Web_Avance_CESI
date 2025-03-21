package mongoModels

import "time"

type OrderPositionHistory struct {
	ID int `bson:"_id" json:"id"`
	OrderID int `bson:"order_id" json:"order_id"`
	DateTime time.Time `bson:"datetime" json:"datetime"`
	Position string `bson:"position" json:"position"`
}

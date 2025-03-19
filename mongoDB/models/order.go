package MongoModels

import "time"

type Order struct {
	OrderID int `bson:"order_id" json:"order_id"`
	DeliveryPersonId int `bson:"delivery_person_id" json:"delivery_person_id"`
	CustomerId int `bson:"customer_id" json:"customer_id"`
	RestaurantId int `bson:"restaurant_id" json:"restaurant_id"`
	items []interface{} `bson:"items" json:"items"`
	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	DeliveryAt time.Time `bson:"delivery_at" json:"delivery_at"`
	Status OrderStatus `bson:"status" json:"status"`
}
	


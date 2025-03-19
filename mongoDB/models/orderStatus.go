package MongoModels

type OrderStatus int

const (
	OrderStatusAwaitingValidation OrderStatus = iota
	OrderStatusInPreparation
	OrderStatusAwaitingCourier
	OrderStatusInDelivery
	OrderStatusDelivered
	OrderStatusClosed
)
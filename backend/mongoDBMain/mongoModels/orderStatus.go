package mongoModels

type OrderStatus string

const (
	OrderStatusAwaitingValidation OrderStatus = "AwaitingValidation"
	OrderStatusInPreparation      OrderStatus = "InPreparation"
	OrderStatusAwaitingCourier    OrderStatus = "AwaitingCourier"
	OrderStatusInDelivery         OrderStatus = "InDelivery"
	OrderStatusDelivered          OrderStatus = "Delivered"
	OrderStatusClosed             OrderStatus = "Closed"
)

func (status OrderStatus) NextStatus() OrderStatus {
	switch status {
	case OrderStatusAwaitingValidation:
		return OrderStatusInPreparation
	case OrderStatusInPreparation:
		return OrderStatusAwaitingCourier
	case OrderStatusAwaitingCourier:
		return OrderStatusInDelivery
	case OrderStatusInDelivery:
		return OrderStatusDelivered
	case OrderStatusDelivered:
		return OrderStatusClosed
	case OrderStatusClosed:
		return OrderStatusClosed
	default:
		return OrderStatusClosed
	}
}
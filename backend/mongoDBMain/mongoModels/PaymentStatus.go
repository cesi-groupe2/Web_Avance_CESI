package mongoModels

type PaymentStatus string

const (
	PaymentStatusAwaitingValidation   PaymentStatus = "AwaitingValidation"
	PaymentStatusInProgress           PaymentStatus = "InProgress"
	PaymentStatusAwaitingConfirmation PaymentStatus = "AwaitingConfirmation"
	PaymentStatusPaid                 PaymentStatus = "Delivered"
	PaymentStatusClosed               PaymentStatus = "Closed"
)

func (status PaymentStatus) NextStatus() PaymentStatus {
	switch status {
	case PaymentStatusAwaitingValidation:
		return PaymentStatusInProgress
	case PaymentStatusInProgress:
		return PaymentStatusAwaitingConfirmation
	case PaymentStatusAwaitingConfirmation:
		return PaymentStatusPaid
	case PaymentStatusPaid:
		return PaymentStatusClosed
	case PaymentStatusClosed:
		return PaymentStatusClosed
	default:
		return PaymentStatusClosed
	}
}

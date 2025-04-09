package userService

import (
	"github.com/gin-gonic/gin"
)

type Notification struct {
	Message  string `json:"message"`
	Severity string `json:"severity"` // "success", "error", "info", "warning"
}

func SendNotification(c *gin.Context, message string, severity string) {
	notification := Notification{
		Message:  message,
		Severity: severity,
	}
	
	c.JSON(200, gin.H{
		"notification": notification,
	})
} 
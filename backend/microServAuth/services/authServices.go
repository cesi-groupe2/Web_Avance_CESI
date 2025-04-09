package authservices

import (
	"errors"
	"fmt"
	"net/smtp"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/columns"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)


func SendEmailForgotPwd(toEmail string, token string) (error) {
	// Set up my authentication information.
	from := utils.GetEnvValueOrDefaultStr(constants.GMAIL_ADDR_ENV, "easeat.corp@gmail.com")
	password := utils.GetEnvValueOrDefaultStr(constants.GMAIL_TOKEN_ENV, "")
	if password == "" {
		return errors.New("password is empty, please set the GMAIL_TOKEN environment variable")
	}

	// Set up smtp
	smtpHost := utils.GetEnvValueOrDefaultStr(constants.SMTP_HOST_ENV, "smtp.gmail.com")
	smtpPort := utils.GetEnvValueOrDefaultStr(constants.SMTP_PORT_ENV, "587")

	// Set up the email content
	subject := "Easeat - Password Reset"
	body := "Click here to reset your password: " + utils.GetEnvValueOrDefaultStr(constants.FRONTEND_URL_ENV, "http://localhost:5173") + "/forgot-password?token=" + token
	address := fmt.Sprintf("%s:%s", smtpHost, smtpPort)
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Send the email
	err := smtp.SendMail(address, auth, from, []string{toEmail}, []byte("Subject: "+subject+"\n\n"+body))
	if err != nil {
		return errors.New("failed to send email: " + err.Error())
	}
	return nil
}

// ResetPassword resets the password for a user
func UpdatePassword(user model.User, newPassword string, db *gorm.DB) error {
	// Hash the new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password: " + err.Error())
	}

	// Update the user's password
	user.PasswordHash = string(hashedPassword)

	// Update the user's password in the database
	result := db.Save(user)
	if result.Error != nil {
		return errors.New("failed to update password: " + result.Error.Error())
	}
	return nil
}

func EmailAlreadyUsed(db *gorm.DB, email string) (bool, error) {
	var user model.User
	result := db.Where(fmt.Sprintf("%s = ?", columns.UserColumnEmail), email).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return false, nil // Email not found
		}
		return false, result.Error // Some other error occurred
	}
	return true, nil // Email already used
}

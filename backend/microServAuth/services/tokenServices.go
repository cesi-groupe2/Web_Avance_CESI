package authservices

import (
	"os"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

// Generate a JWT token for the user (we supose the user is already authenticated)
func GenerateAccessToken(ctx *gin.Context, user model.User) (string, error) {
	// Generate a token with the user's username (can replace with user's ID) and an expiration time of 2min
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.IDRole,
		"userRoleId": user.IDRole,
		"iat":      time.Now().Unix(),
		"exp":      time.Now().Add(time.Minute * 2).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv(constants.ACCESS_JWT_KEY_ENV)))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

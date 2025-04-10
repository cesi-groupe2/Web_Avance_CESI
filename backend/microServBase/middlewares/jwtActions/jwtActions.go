package jwtActions

import (
	"os"
	"strings"
	"log"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func RemoveBearerPrefix(token string) string {
	if strings.Contains(token, "Bearer ") {
		return strings.TrimPrefix(token, "Bearer ")
	}
	return token
}

func IsExpired(token *jwt.Token) bool {
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if exp, ok := claims["exp"].(float64); ok {
			return int64(exp) < jwt.TimeFunc().Unix()
		}
	}
	return false
}

func HaveGoodSecretKey(token *jwt.Token, secretKey string) bool {
	if _, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return true
	}
	log.Println(secretKey)
	return false
}

func CheckIsRoadDoc(ctx *gin.Context) bool {
	if strings.Contains(ctx.Request.URL.Path, "/docs") || strings.Contains(ctx.Request.URL.Path, "/swagger") {
		return true
	}
	return false
}

func GetUserIdFromToken(ctx *gin.Context) (int, error) {
	tokenString := ctx.Request.Header.Get("Authorization")
	tokenString = RemoveBearerPrefix(tokenString)

	if tokenString == "" {
		return 0, nil
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv(constants.ACCESS_JWT_KEY_ENV)), nil
	})
	if err != nil {
		return 0, err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if id, ok := claims["userId"].(float64); ok {
			return int(id), nil
		}
	}
	return 0, nil
}

func GetUserRoleFromToken(ctx *gin.Context) (int, error) {
	tokenString := ctx.Request.Header.Get("Authorization")
	tokenString = RemoveBearerPrefix(tokenString)

	if tokenString == "" {
		return 0, nil
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv(constants.ACCESS_JWT_KEY_ENV)), nil
	})
	if err != nil {
		return 0, err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if roleId, ok := claims["userRoleId"].(float64); ok {
			return int(roleId), nil
		}
	}
	return 0, nil
}

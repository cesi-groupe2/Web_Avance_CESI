package middlewares

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares/jwtActions"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

// @Security BearerAuth
// AuthMiddleware is a middleware that checks if the user is authenticated (token is valid)
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// pass doc roads
		if jwtActions.CheckIsRoadDoc(c) {
			c.Next()
			return
		}

		// Get the token from the header
		token := c.Request.Header.Get("Authorization")
		log.Println("Token:", token)
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
			c.Abort()
			return
		}

		// remove the "Bearer " prefix if it exists
		token = jwtActions.RemoveBearerPrefix(token)
		secretKey := os.Getenv(constants.ACCESS_JWT_KEY_ENV)

		tokenJwt, _ := jwt.Parse(token, func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(secretKey), nil
		})

		// check if the token have good secret key
		if !jwtActions.HaveGoodSecretKey(tokenJwt, secretKey) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token, wrong secret key"})
			c.Abort()
			return
		}

		// check if the token is valid
		if err := tokenJwt.Claims.Valid(); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// check the time validity of the token
		if jwtActions.IsExpired(tokenJwt) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token expired"})
			c.Abort()
			return
		}
		c.Next()
	}
}




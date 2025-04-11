package middlewares

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

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
		authHeader := c.Request.Header.Get("Authorization")
		log.Printf("Authorization header reçu: %s", authHeader)
		if authHeader == "" {
			log.Println("Authorization header manquant")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
			c.Abort()
			return
		}

		// Vérifier le format Bearer
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			log.Printf("Format du token invalide: %s", authHeader)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		token := parts[1]
		log.Printf("Token extrait: %s", token)
		
		// Obtenir la clé secrète
		secretKey := os.Getenv("ACCESS_JWT_KEY")
		log.Printf("Secret key chargée: %s", secretKey)
		if secretKey == "" {
			log.Printf("La clé secrète est vide")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Server configuration error"})
			c.Abort()
			return
		}

		// Parser le token
		tokenJwt, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
			log.Printf("Méthode de signature: %v", t.Header["alg"])
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(secretKey), nil
		})

		if err != nil {
			log.Printf("Erreur lors du parsing du token: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Vérifier la validité du token
		if claims, ok := tokenJwt.Claims.(jwt.MapClaims); ok && tokenJwt.Valid {
			log.Printf("Token valide avec claims: %+v", claims)
			// Vérifier l'expiration
			if jwtActions.IsExpired(tokenJwt) {
				log.Printf("Token expiré")
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token expired"})
				c.Abort()
				return
			}
			c.Next()
		} else {
			log.Printf("Token invalide")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}
	}
}




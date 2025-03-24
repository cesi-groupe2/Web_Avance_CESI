package roads

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleUsersRoads(ctx context.Context, router *gin.RouterGroup) {

	router.GET("/users", func(c *gin.Context) {
		// request the microservice at address localhost:8081
		httpResponse, err := http.Get("http://localhost:8082/users")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}
		defer httpResponse.Body.Close()

		body, err := io.ReadAll(httpResponse.Body)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		var users interface{}
		if err = json.Unmarshal(body, &users); err != nil {
			// If the body isn't valid JSON, return it as a string.
			c.JSON(http.StatusOK, gin.H{
				"users": string(body),
			})
			return
		}

		c.JSON(http.StatusOK,
			users,
		)
	})
}

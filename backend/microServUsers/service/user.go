package userService

import "github.com/gin-gonic/gin"

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func GetUser(c *gin.Context) {
	user := User{
		ID:       "0",
		Username: "testUserName",
		Email:    "testEmail",
	}
	c.JSON(200, user)
}

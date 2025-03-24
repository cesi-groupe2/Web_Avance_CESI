package userService

import "github.com/gin-gonic/gin"

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func GetUser(c *gin.Context) {
	user := User{
		ID:       "0",
		Username: "testUserName",
		Email:    "testEmail",
		Password: "testPassword",
	}
	c.JSON(200, user)
}

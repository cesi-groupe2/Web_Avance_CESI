package handlers

import (
	"net/http"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/middleware"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/models"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/repository"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login godoc
//	@Summary		Login
//	@Description	Login
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			loginRequest	body		LoginRequest	true	"Login request"
//	@Success		200				{object}	string
//	@Failure		400				{object}	string
//	@Failure		401				{object}	string
//	@Failure		500				{object}	string
//	@Router			/login [post]
func Login(c *gin.Context) {
	var loginReq LoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	user, err := repository.GetUserByEmail(loginReq.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginReq.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
		return
	}

	token, err := middleware.GenerateToken(user.ID, user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func Register(c *gin.Context) {
	var registerReq LoginRequest
	if err := c.ShouldBindJSON(&registerReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerReq.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Password hashing failed"})
		return
	}

	user := &models.User{
		Email:    registerReq.Email,
		Password: string(hashedPassword),
	}

	if err := repository.CreateUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User creation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}

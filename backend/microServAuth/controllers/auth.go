package authController

import (
	"log"
	"os"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/session"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Register godoc
// @Summary Register a new user
// @Description Register a new user
// @Tags auth
// @Accept  json
// @Produce  json
// @Param email formData string true "Email"
// @Param password formData string true "Password"
// @Param picture formData string false "Picture"
// @Param firstname formData string true "Firstname"
// @Param lastname formData string true "Lastname"
// @Param phone formData string false "Phone"
// @Param deliveryAdress formData string false "Delivery adress"
// @Param facturationAdress formData string false "Facturation adress"
// @Param role formData string true "Role"
// @Success 200 {string} string	"msg": "ok"
// @Failure 400 {string} string	"msg": "Email is required"
// @Failure 400 {string} string	"msg": "Password is required"
// @Failure 400 {string} string	"msg": "Role is required"
// @Router /auth/register [post]
func Register(ctx *gin.Context, db *gorm.DB) {
	// Create a new user
	email := ctx.PostForm("email")
	if email == "" {
		ctx.JSON(400, "Email is required")
		return
	}
	pwd, err := bcrypt.GenerateFromPassword([]byte(ctx.PostForm("password")), bcrypt.DefaultCost)
	if err != nil {
		log.Println(err)
		ctx.JSON(400, "Password is required")
		return
	}
	picture := ctx.PostForm("picture")
	firstname := ctx.PostForm("fistname")
	lastname := ctx.PostForm("lastname")
	phone := ctx.PostForm("phone")
	deliveryAdress := ctx.PostForm("deliveryAdress")
	facturationAdress := ctx.PostForm("facturationAdress")
	role := ctx.PostForm("role")
	if role == "" {
		ctx.JSON(400, "Role is required")
		return
	}

	// Get the role
	roleObj := model.Role{}
	result := db.Where(&model.Role{
		Name: role,
	}).First(&roleObj)
	if result.Error != nil {
		log.Println(result.Error)
		ctx.JSON(400, "Role not found")
		return
	}

	newUser := model.User{
		Email:             email,
		PasswordHash:      string(pwd),
		ProfilPicture:     picture,
		FirstName:         firstname,
		LastName:          lastname,
		Phone:             phone,
		DeliveryAdress:    deliveryAdress,
		FacturationAdress: facturationAdress,
		IDRole:            roleObj.IDRole,
		CreatedAt:         time.Now(),
	}

	result = db.Create(&newUser)
	if result.Error != nil {
		log.Println(result.Error)
	}

	ctx.JSON(200, "ok")
}

// Login godoc
// @Summary Login a user
// @Description Login a user
// @Tags auth
// @Accept  json
// @Produce  json
// @Param email formData string true "Email"
// @Param password formData string true "Password"
// @Success 200 {object} map[string]interface{} "user": model.User, "token": string
// @Failure 401 {string} string "msg": "User not found !"
// @Router /auth/login [post]
func Login(ctx *gin.Context, db *gorm.DB) {
	var currentUser model.User

	// Check if the user exists
	mail := ctx.PostForm("email")
	if mail == "" {
		ctx.JSON(401, "Mail is required")
		return
	}
	inputPassword := ctx.PostForm("password")
	if inputPassword == "" {
		ctx.JSON(401, "Password is required")
		return
	}

	users := []model.User{}
	result := db.Where(&model.User{
		Email: mail,
	}).Find(&users)
	if result.Error != nil {
		log.Println(result.Error)
		ctx.JSON(401, "User not found !")
		return
	}

	// Check if the password is correct
	for _, user := range users {
		err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(inputPassword))
		if err != nil {
			log.Println(err)
			ctx.JSON(401, "User not found !")
			return
		}
		currentUser = user
	}

	// Generate a JWT token for the user
	token, err := GenerateAccessToken(ctx, currentUser)
	if err != nil {
		log.Println(err)
		ctx.JSON(500, "Error generating token")
		return
	}

	// Save the user in the session
	session.SetUserSession(ctx, currentUser)

	ctx.JSON(200, gin.H{
		"user": currentUser,
		"token":token,
	})
} 


// Generate a JWT token for the user (we supose the user is already authenticated)
func GenerateAccessToken(ctx *gin.Context, user model.User) (string, error) {
	// Generate a token with the user's username (can replace with user's ID) and an expiration time of 2min
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.IDRole,
		"iat":      time.Now().Unix(),
		"exp":      time.Now().Add(time.Minute * 2).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv(constants.ACCESS_JWT_KEY_ENV)))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// RefreshToken godoc
// @Summary Refresh the JWT token
// @Description Refresh the JWT token
// @Tags auth
// @Accept  json
// @Produce  json
// @Param token formData string true "Token"
// @Success 200 {string} string "msg": "ok"
// @Failure 401 {string} string "msg": "Token is required"
// @Router /auth/refreshToken [post]
func RefreshToken(ctx *gin.Context) {
	token := ctx.PostForm("token")
	if token == "" {
		ctx.JSON(401, "Token is required")
		return
	}

	// Check if the token is valid
	_, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv(constants.ACCESS_JWT_KEY_ENV)), nil
	})
	if err != nil {
		log.Println(err)
		ctx.JSON(401, "Invalid token")
		return
	}

	// Generate a new token
	newToken, err := GenerateAccessToken(ctx, model.User{})
	if err != nil {
		log.Println(err)
		ctx.JSON(500, "Error generating token")
		return
	}

	ctx.JSON(200, gin.H{
		"token": newToken,
	})
}

// Logout godoc
// @Summary Logout the user
// @Description Logout the user
// @Tags auth
// @Accept  json
// @Produce  json
// @Success 200 {string} string "msg": "ok"
// @Router /auth/logout [post]
func Logout(ctx *gin.Context) {
	session.DeleteUserSession(ctx)
	ctx.JSON(200, "ok")
}

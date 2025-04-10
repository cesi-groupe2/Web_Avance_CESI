package authController

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	authservices "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/services"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares/jwtActions"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Register godoc
//
//	@Summary		Register a new user
//	@Description	Register a new user
//	@Tags			public
//	@Accept			application/x-www-form-urlencoded
//	@Produce		json
//	@Param			email				formData	string	true	"Email"
//	@Param			password			formData	string	true	"Password"
//	@Param			picture				formData	file	false	"Picture"
//	@Param			firstname			formData	string	true	"Firstname"
//	@Param			lastname			formData	string	true	"Lastname"
//	@Param			phone				formData	string	false	"Phone"
//	@Param			deliveryAdress		formData	string	false	"Delivery adress"
//	@Param			facturationAdress	formData	string	false	"Facturation adress"
//	@Param			role				formData	string	true	"Role"
//	@Success		200					{string}	string	"msg":	"ok"
//	@Failure		400					{string}	string	"msg":	"Email is required"
//	@Failure		400					{string}	string	"msg":	"Password is required"
//	@Failure		400					{string}	string	"msg":	"Role is required"
//	@Router			/public/register [post]
func Register(ctx *gin.Context, db *gorm.DB) {
	// Create a new user
	email := ctx.PostForm("email")
	if email == "" {
		ctx.JSON(400, "Email is required")
		return
	}
	// Check if the email is already used
	isUsed, err := authservices.EmailAlreadyUsed(db, email)
	if err != nil {
		log.Println(err)
		ctx.JSON(500, "Error checking email")
		return
	}
	if isUsed {
		ctx.JSON(400, "Email already used")
		return
	}

	// Check if the password is empty
	pwd, err := bcrypt.GenerateFromPassword([]byte(ctx.PostForm("password")), bcrypt.DefaultCost)
	if err != nil {
		log.Println(err)
		ctx.JSON(400, "Password is required")
		return
	}
	picture := ctx.PostForm("picture")
	firstname := ctx.PostForm("firstname")
	lastname := ctx.PostForm("lastname")
	phone := ctx.PostForm("phone")
	deliveryAdress := ctx.PostForm("deliveryAdress")
	facturationAdress := ctx.PostForm("facturationAdress")
	picture, err := utils.PictureFromForm(ctx, "picture")
	if err != nil {
		picture = []byte{}
	}
	role := ctx.PostForm("role")
	if role == "" {
		ctx.JSON(400, "Role is required")
		return
	}

	roleInt64, err := strconv.ParseInt(role, 10, 32)
	if err != nil {
		ctx.JSON(400, "Role must be a valid number")
		return
	}

	// Get the role
	roleObj := model.Role{}
	result := db.Where(&model.Role{
		IDRole: int32(roleInt64),
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

	// Generate a sponsorship code
	sponsorshipCode, err := authservices.GenerateSponsorShipsCode(db, newUser)
	if err != nil {
		log.Println(err)
		ctx.JSON(500, "Error generating sponsorship code")
		return
	}
	newUser.SponsorshipCode = sponsorshipCode

	result = db.Create(&newUser)
	if result.Error != nil {
		log.Println(result.Error)
	}

	ctx.JSON(200, "ok")
}

// Login godoc
//
//	@Summary		Login a user
//	@Description	Login a user
//	@Tags			public
//	@Accept			application/x-www-form-urlencoded
//	@Produce		json
//	@Param			email		formData	string					true	"Email"
//	@Param			password	formData	string					true	"Password"
//	@Success		200			{object}	map[string]interface{}	"user":	model.User,	"token":	string
//	@Failure		401			{string}	string					"msg":	"User not found !"
//	@Router			/public/login [post]
func Login(ctx *gin.Context, db *gorm.DB) {
	var currentUser model.User

	// Check if the user exists
	mail := ctx.PostForm("email")
	if mail == "" {
		ctx.JSON(401, gin.H{"error": "Mail is required"})
		return
	}
	inputPassword := ctx.PostForm("password")
	if inputPassword == "" {
		ctx.JSON(401, gin.H{"error": "Password is required"})
		return
	}

	users := []model.User{}
	result := db.Where(&model.User{
		Email: mail,
	}).Find(&users)
	log.Println(users)
	if result.Error != nil || len(users) == 0 {
		log.Println(result.Error)
		ctx.JSON(401, gin.H{"error": "Email not found !"})
		return
	}

	// Check if the password is correct
	for _, user := range users {
		err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(inputPassword))
		if err != nil {
			log.Println(err)
			ctx.JSON(401, gin.H{"error": "Password is incorrect !"})
			return
		}
		currentUser = user
	}

	// Generate a JWT token for the user
	token, err := authservices.GenerateAccessToken(ctx, currentUser)
	if err != nil {
		log.Println(err)
		ctx.JSON(500, gin.H{"error": "Error generating token"})
		return
	}

	// Ensure password hash is not sent to the client
	currentUser.PasswordHash = ""

	ctx.JSON(200, gin.H{
		"user":  currentUser,
		"token": token,
	})
}

// RefreshToken godoc
//
//	@Summary		Refresh the JWT token
//	@Description	Refresh the JWT token
//	@Tags			auth
//	@Security		BearerAuth
//	@Accept			application/x-www-form-urlencoded
//	@Produce		json
//	@Param			token	formData	string	true	"Token"
//	@Success		200		{string}	string	"msg":	"ok"
//	@Failure		401		{string}	string	"msg":	"Token is required"
//	@Router			/auth/refreshToken [post]
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
	newToken, err := authservices.GenerateAccessToken(ctx, model.User{})
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
//
//	@Summary		Logout the user
//	@Description	Logout the user
//	@Tags			auth
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Success		200	{string}	string	"msg":	"ok"
//	@Router			/auth/logout [post]
func Logout(ctx *gin.Context) {
	ctx.JSON(200, "ok")
}

// GetMe godoc
//
//	@Summary		Get the current user
//	@Description	Get the current user
//	@Tags			auth
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	model.User
//	@Failure		401	{string}	string	"msg":	"User not found"
//	@Router			/auth/me [get]
func GetMe(ctx *gin.Context, db *gorm.DB) {
	userId, err := jwtActions.GetUserIdFromToken(ctx)
	if err != nil {
		log.Println(err)
		ctx.JSON(401, "User not found")
		return
	}

	log.Println("userID from token", userId)
	currentUser := model.User{}
	result := db.Where(&model.User{
		IDUser: int32(userId),
	}).First(&currentUser)
	if result.Error != nil {
		log.Println(result.Error)
		ctx.JSON(401, "User not found")
		return
	}
	log.Println(currentUser)

	ctx.JSON(200, currentUser)
}

// DeleteAccount godoc
//
//	@Summary		Delete the current user account
//	@Description	Delete the current user account
//	@Tags			auth
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Success		200	{string}	string	"msg":	"Account deleted successfully"
//	@Failure		401	{string}	string	"msg":	"User not found"
//	@Failure		500	{string}	string	"msg":	"Failed to delete account"
//	@Router			/auth/delete-account [delete]
func DeleteAccount(ctx *gin.Context, db *gorm.DB) {
	userId, err := jwtActions.GetUserIdFromToken(ctx)
	if err != nil {
		log.Println(err)
		ctx.JSON(401, "User not found")
		return
	}

	log.Println("Delete account for userID:", userId)

	// Trouver l'utilisateur pour vérifier qu'il existe
	currentUser := model.User{}
	result := db.Where(&model.User{
		IDUser: int32(userId),
	}).First(&currentUser)
	if result.Error != nil {
		log.Println(result.Error)
		ctx.JSON(401, "User not found")
		return
	}

	// Supprimer l'utilisateur
	result = db.Delete(&currentUser)
	if result.Error != nil {
		log.Println("Failed to delete user:", result.Error)
		ctx.JSON(500, "Failed to delete account")
		return
	}

	log.Println("User account deleted successfully, ID:", userId)
	ctx.JSON(200, "Account deleted successfully")
}

// UpdateProfile godoc
//
//	@Summary		Update the current user profile
//	@Description	Update the current user profile
//	@Tags			auth
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			firstname			body		string	false	"First name"
//	@Param			lastname			body		string	false	"Last name"
//	@Param			phone				body		string	false	"Phone"
//	@Param			deliveryAdress		body		string	false	"Delivery address"
//	@Param			facturationAdress	body		string	false	"Facturation address"
//	@Success		200					{string}	string	"msg":	"Profile updated successfully"
//	@Failure		401					{string}	string	"msg":	"User not found"
//	@Failure		500					{string}	string	"msg":	"Failed to update profile"
//	@Router			/auth/update-profile [post]
func UpdateProfile(ctx *gin.Context, db *gorm.DB) {
	// Récupérer l'ID de l'utilisateur à partir du token JWT
	userId, err := jwtActions.GetUserIdFromToken(ctx)
	if err != nil {
		log.Println(err)
		ctx.JSON(401, "User not found")
		return
	}

	log.Println("Updating profile for userID:", userId)

	// Trouver l'utilisateur pour vérifier qu'il existe
	currentUser := model.User{}
	result := db.Where(&model.User{
		IDUser: int32(userId),
	}).First(&currentUser)
	if result.Error != nil {
		log.Println(result.Error)
		ctx.JSON(401, "User not found")
		return
	}

	// Récupérer les données du body
	var updateData struct {
		Firstname         string `json:"firstname"`
		Lastname          string `json:"lastname"`
		Phone             string `json:"phone"`
		DeliveryAdress    string `json:"deliveryAdress"`
		FacturationAdress string `json:"facturationAdress"`
	}

	if err := ctx.ShouldBindJSON(&updateData); err != nil {
		log.Println("Error binding JSON:", err)
		ctx.JSON(400, "Invalid request data")
		return
	}

	// Log des données reçues pour debug
	log.Printf("Update profile data: %+v", updateData)

	// Mettre à jour uniquement les champs fournis
	updates := make(map[string]interface{})

	if updateData.Firstname != "" {
		updates["first_name"] = updateData.Firstname
	}

	if updateData.Lastname != "" {
		updates["last_name"] = updateData.Lastname
	}

	if updateData.Phone != "" {
		updates["phone"] = updateData.Phone
	}

	if updateData.DeliveryAdress != "" {
		updates["delivery_adress"] = updateData.DeliveryAdress
	}

	if updateData.FacturationAdress != "" {
		updates["facturation_adress"] = updateData.FacturationAdress
	}

	// Si aucun champ à mettre à jour, retourner une réponse de succès
	if len(updates) == 0 {
		ctx.JSON(200, "No changes to apply")
		return
	}

	// Mettre à jour l'utilisateur
	result = db.Model(&currentUser).Updates(updates)
	if result.Error != nil {
		log.Println("Failed to update user:", result.Error)
		ctx.JSON(500, "Failed to update profile")
		return
	}

	log.Println("User profile updated successfully, ID:", userId)
	ctx.JSON(200, "Profile updated successfully")
}

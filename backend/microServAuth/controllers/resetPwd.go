package authController

import (
	"log"
	"strconv"

	authservices "github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/services"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ForgotPassword godoc
// @Summary Forgot password, send an email to the user
// @Description Forgot password, send an email to the user
// @Tags public
// @Accept  application/x-www-form-urlencoded
// @Produce  json
// @Param email formData string true "Email"
// @Success 200 {string} string "msg": "ok"
// @Failure 400 {string} string "msg": "Email is required"
// @Failure 401 {string} string "msg": "User not found !"
// @Router /public/forgotPassword [post]
func ForgotPassword(ctx *gin.Context, db *gorm.DB) {
	email := ctx.PostForm("email")
	if email == "" {
		ctx.JSON(400, "Email is required")
		return
	}

	user := model.User{}
	result := db.Where(&model.User{
		Email: email,
	}).Find(&user)
	if result.Error != nil {
		log.Println(result.Error)
		ctx.JSON(401, "User not found !")
		return
	}

	// Generate a token for the user
	token, err := authservices.GenerateAccessToken(ctx, user)
	if err != nil {
		log.Println(err)
		ctx.JSON(500, "Error generating token")
		return
	}

	// Send the email
	err = authservices.SendEmailForgotPwd(email, token)
	if err != nil {
		log.Println(err)
		ctx.JSON(500, "Error sending email")
		return
	}
	ctx.JSON(200, "ok")
}

// ResetPwd godoc
// @Summary Reset password
// @Description Reset password 
// @Tags auth
// @Accept  application/x-www-form-urlencoded
// @Produce  json
// @Param userId path int true "User ID"
// @Param password formData string true "New password"
// @Success 200 {string} string "msg": "ok"
// @Failure 400 {string} string "msg": "Password is required"
// @Failure 401 {string} string "msg": "User not found !"
// @Router /auth/resetPwd/{userId} [post]
// @Security BearerAuth
func ResetPwd(ctx *gin.Context, db *gorm.DB) {
	// Get the user ID from the URL
	userIdStr := ctx.Param("userId")
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		ctx.JSON(400, "Invalid user ID")
		return
	}
	// Get the new password from the form
	newPassword := ctx.PostForm("password")
	if newPassword == "" {
		ctx.JSON(400, "Password is required")
		return
	}

	user := model.User{}
	result := db.Where(&model.User{
		IDUser: int32(userId),
	}).Find(&user)
	if result.Error != nil {
		log.Println(result.Error)
		ctx.JSON(401, "User not found !")
		return
	}

	err = authservices.UpdatePassword(user, newPassword, db)
	if err != nil {
		log.Println(err)
		ctx.JSON(500, "Error updating password")
		return
	}

	ctx.JSON(200, "ok")
}

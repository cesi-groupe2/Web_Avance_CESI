package authController

import (
	"fmt"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares/jwtActions"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/columns"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SponsoriseByCode godoc
//	@Summary		Sponsorise a user by code
//	@Description	Sponsorise a user with sponsorship code
//	@Tags			sponso
//	@Accept			json
//	@Produce		json
//	@Param			code	path		string	true	"Sponsorship code"
//	@Success		200		{string}	string	"msg":	"ok"
//	@Failure		400		{string}	string	"msg":	"Code is required"
//	@Failure		400		{string}	string	"msg":	"Invalid code"
//	@Failure		400		{string}	string	"msg":	"You cannot sponsorise yourself"
//	@Failure		400		{string}	string	"msg":	"User not found in session"
//	@Router			/{code} [get]
func SponsoriseByCode(ctx *gin.Context, db *gorm.DB) {
	code := ctx.Param("code")
	if code == "" {
		ctx.JSON(400, "Code is required")
		return
	}
	
	// Check if the code is valid
	var godFather model.User
	if err := db.Where(fmt.Sprintf("%s = ?", columns.UserColumnSponsorshipCode), code).First(&godFather).Error; err != nil || godFather.IDUser == 0 {
		ctx.JSON(400, "Invalid code")
		return
	}
	
	// Set user to sponsorised
	userId, err := jwtActions.GetUserIdFromToken(ctx)
	if err != nil {
		ctx.JSON(400, "User not found in session")
		return
	}

	var user = model.User{
		IDUser: int32(userId),
	}
	db.First(&user)
	if user.IDUser == 0 {
		ctx.JSON(400, "User not found in session")
		return
	}
	if user.IDUser == godFather.IDUser {
		ctx.JSON(400, "You cannot sponsorise yourself")
		return
	}
	user.AlreadySponsored = true
	db.Save(&user)

	ctx.JSON(200, "ok")
} 

// GetMyCode godoc
//	@Summary		Get my sponsorship code
//	@Description	Get my sponsorship code
//	@Tags			sponso
//	@Accept			json
//	@Produce		json
//	@Success		200	{string}	string	"msg":	"ok"
//	@Failure		400	{string}	string	"msg":	"No code found"
//	@Failure		400	{string}	string	"msg":	"User not found in session"
//	@Router			/myCode [get]
func GetMyCode(ctx *gin.Context, db *gorm.DB) {
	userId, err := jwtActions.GetUserIdFromToken(ctx)
	if err != nil {
		ctx.JSON(400, "User not found in session")
		return
	}
	var user model.User
	if err := db.First(&model.User{
		IDUser: int32(userId),
	}).First(&user).Error; err != nil {
		ctx.JSON(400, "User not found in bdd")
		return
	}
	if user.SponsorshipCode == "" {
		ctx.JSON(400, "No code found")
	}
	ctx.JSON(200, user.SponsorshipCode)
}

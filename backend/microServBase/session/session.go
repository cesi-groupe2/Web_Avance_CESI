package session

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"github.com/gin-gonic/gin"
)

func SetUserSession(ctx *gin.Context, user model.User) {
	ctx.Set("user", user)
}

func GetUserSession(ctx *gin.Context) model.User {
	return ctx.MustGet("user").(model.User)
}

func DeleteUserSession(ctx *gin.Context) {
	ctx.Set("user", nil)
}

func IsUserConnected(ctx *gin.Context) bool {
	return ctx.MustGet("user") != nil
}

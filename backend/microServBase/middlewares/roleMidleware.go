package middlewares

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/session"
	"github.com/gin-gonic/gin"
)

// @Security BearerAuth
func CanAccessMiddleware(ctx *gin.Context, rolesAllowed ...int32) bool {
	currentUser, err := session.GetUserSession(ctx)
	if err != nil || currentUser.IDUser == 0 {
		ctx.JSON(403, "You are not authenticated")
		ctx.Abort()
		return false
	}
	for _, roleId := range rolesAllowed {
		if currentUser.IDRole == roleId {
			ctx.Next()
			return true
		}
	}
	ctx.JSON(403, "You don't have the right role")
	ctx.Abort()
	return false
}

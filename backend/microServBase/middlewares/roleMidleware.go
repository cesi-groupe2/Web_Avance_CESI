package middlewares

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares/jwtActions"
	"github.com/gin-gonic/gin"
)

// @Security BearerAuth
func CanAccessMiddleware(ctx *gin.Context, rolesAllowed ...int32) bool {
	userRole, err := jwtActions.GetUserRoleFromToken(ctx)
	if err != nil {
		ctx.JSON(403, err)
		ctx.Abort()
		return false
	}
	for _, roleId := range rolesAllowed {
		if int32(userRole) == roleId {
			ctx.Next()
			return true
		}
	}
	ctx.JSON(403, "You don't have the right role")
	ctx.Abort()
	return false
}

package middlewares

import (
	"log"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares/jwtActions"
	"github.com/gin-gonic/gin"
)

// @Security BearerAuth
func CanAccessMiddleware(rolesAllowed ...int32) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userRole, err := jwtActions.GetUserRoleFromToken(ctx)
		if err != nil {
			log.Println("Error getting user role from token:", err)
			ctx.JSON(403, err)
			ctx.Abort()
			return
		}
		for _, roleId := range rolesAllowed {
			if int32(userRole) == roleId {
				log.Println("User role is allowed:", userRole)
				ctx.Next()
				return
			}
		}
		ctx.JSON(403, "You don't have the right role")
		ctx.Abort()
	}
}

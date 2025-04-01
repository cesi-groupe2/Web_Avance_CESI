package middlewares

import (
	"strconv"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/session"
	"github.com/gin-gonic/gin"
)

// CanAccessMiddleware godoc
// @Summary Check if the user has the right role
// @Description Check if the user has the right role
// @Tags middlewares
// @Accept json
// @Produce json
// @Param roleId path int true "Role id"
// @Success 200 {string} string
// @Failure 403 {string} string
// @Router /canAccess/{roleId} [get]
func CanAccessMiddleware(ctx *gin.Context) bool {
	roleIdStr := ctx.Param("roleId")
	id, err := strconv.Atoi(roleIdStr)
	if err != nil {
		ctx.JSON(403, "Invalid role id")
		ctx.Abort()
		return false
	}
	roleId := int32(id)
	currentUser := session.GetUserSession(ctx)
	if currentUser.IDRole ==  roleId{
		ctx.Next()
		return true
	}
	ctx.JSON(403, "You don't have the right role")
	return false
}

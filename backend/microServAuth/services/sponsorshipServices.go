package authservices

import (
	"fmt"
	"math/rand"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/columns"
	"gorm.io/gorm"
)

// GenerateSponsorShipsCode generates a unique sponsorship code for a user, not put on user this code
func GenerateSponsorShipsCode(db *gorm.DB, user model.User) (string, error) {
	// Generate a random code
	codeBase := rand.Intn(999999)
	code := user.Email[:2] + string(codeBase)

	// Check if the code already exists in the database
	var userWithExistingCode model.User
	result := db.Where(fmt.Sprintf("%s = ?", columns.UserColumnSponsorshipCode), code).First(&userWithExistingCode)
	if result.Error == nil || result.RowsAffected > 0 {
		// Code already exists, generate a new one
		return GenerateSponsorShipsCode(db, user)
	}
	return code, nil
}

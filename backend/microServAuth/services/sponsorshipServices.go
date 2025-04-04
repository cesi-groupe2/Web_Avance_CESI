package authservices

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/columns"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"gorm.io/gorm"
)

// GenerateSponsorShipsCode generates a unique sponsorship code for a user, not put on user this code
func GenerateSponsorShipsCode(db *gorm.DB, user model.User) (string, error) {
	// Generate a random code
	rand.Seed(time.Now().UnixNano())
	codeBase := rand.Intn(999999)
	code := user.Email[:2] + fmt.Sprintf("%06d", codeBase)

	// Check if the code already exists in the database
	var userWithExistingCode model.User
	result := db.Where(fmt.Sprintf("%s = ?", columns.UserColumnSponsorshipCode), code).First(&userWithExistingCode)
	if result.Error == nil || result.RowsAffected > 0 {
		// Code already exists, generate a new one
		return GenerateSponsorShipsCode(db, user)
	}
	return code, nil
}

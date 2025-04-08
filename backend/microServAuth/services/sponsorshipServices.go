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
	// Seed the random number generator once per function call
	rand.Seed(time.Now().UnixNano())

	// Check that user.Email has at least 2 characters
	if len(user.Email) < 2 {
		return "", fmt.Errorf("email is too short to generate a code")
	}

	// Generate a code using the first two characters of the email and a random 6-digit number
	codeBase := rand.Intn(999999)
	code := user.Email[:2] + fmt.Sprintf("%06d", codeBase)

	// Check if the code already exists in the database
	var userWithExistingCode model.User
	err := db.
		Where(fmt.Sprintf("%s = ?", columns.UserColumnSponsorshipCode), code).
		First(&userWithExistingCode).Error

	// If an error occurred and it's not a "record not found" error, return the error.
	if err != nil && err != gorm.ErrRecordNotFound {
		return "", err
	}
	// If the code exists, recursively try to generate a new one.
	if err == nil {
		return GenerateSponsorShipsCode(db, user)
	}
	// Otherwise, the code is unique.
	return code, nil
}

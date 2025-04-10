package DeliveryPersonService

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/customModels"
)

// To clean users offline in currentUsersInWork
func CleanUserOfflineInCurrentUsersInWork() {
	// get all users in work
	usersInWork := customModels.GetAllUsersInWork()
	for _, user := range usersInWork {
		// check if user is offline
		if user.Status == customModels.StatusOffline {
			// delete user in work
			customModels.DeleteUserInWork(user.IDUser)
		}
	}
}

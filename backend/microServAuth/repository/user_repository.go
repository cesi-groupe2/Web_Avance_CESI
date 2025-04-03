package repository

import (
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/database"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServAuth/models"
)

func GetUserByEmail(email string) (*models.User, error) {
	user := &models.User{}
	query := "SELECT id, username, email, password FROM users WHERE email = @p1"
	err := database.DB.QueryRow(query, email).Scan(&user.ID, &user.Username, &user.Email, &user.Password)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func CreateUser(user *models.User) error {
	query := "INSERT INTO users (email, password) VALUES (@p1, @p2)"
	_, err := database.DB.Exec(query, user.Email, user.Password)
	if err != nil {
		return err
	}
	return nil
}

package services

import (
	"go_backend/database"
	"go_backend/models"
	"log"
)

func GetAllUsers() ([]models.User, error) {
	query := "SELECT id, name, email, password FROM users"
	rows, err := database.Db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Password); err != nil {
			log.Println("Error scanning row:", err)
			continue
		}
		users = append(users, user)
	}

	return users, nil
}

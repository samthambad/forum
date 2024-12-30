package services

import (
	"fmt"
	"go_backend/database"
	"go_backend/models"
	"log"
)

func GetAllUsers() ([]models.User, error) {
	query := "SELECT id, username, email FROM users;"
	rows, err := database.Db.Query(query)
	fmt.Println("hello from GetAllUsers", err)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var users []models.User
	for rows.Next() {
		var user models.User
		// values from each column are passed into the user variables
		if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
			log.Println("Error scanning row:", err)
			continue
		}
		users = append(users, user)
	}

	return users, nil
}

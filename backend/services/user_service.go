package services

import (
	"fmt"
	"go_backend/database"
	"log"
)

// func GetAllUsers() ([]models.User, error) {
func GetAllUsers() {
	query := "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"

	// Execute the query
	rows, err := database.Db.Query(query)
	if err != nil {
		log.Fatal("Error executing query: ", err)
	}
	defer rows.Close()

	// Iterate over the rows and print the table names
	fmt.Println("Tables in the database:")
	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			log.Fatal("Error scanning row: ", err)
		}
		fmt.Println(tableName)
	}
	// query := "SELECT id, username, email FROM users;"
	// rows, err := database.Db.Query(query)
	// fmt.Println("hello from GetAllUsers", err)
	// if err != nil {
	// 	return nil, err
	// }
	// defer rows.Close()
	// var users []models.User
	// for rows.Next() {
	// 	var user models.User
	// 	// values from each column are passed into the user variables
	// 	if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
	// 		log.Println("Error scanning row:", err)
	// 		continue
	// 	}
	// 	users = append(users, user)
	// }

	// return users, nil
}

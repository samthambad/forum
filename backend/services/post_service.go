package services

import (
	"fmt"
	"go_backend/database"
	"go_backend/models"
	"log"
)

func GetAllThreads() ([]models.Thread, error) {
	query := "SELECT id, title, content, created_by, created_at FROM threads;"
	rows, err := database.Db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var threads []models.Thread
	for rows.Next() {
		var thread models.Thread
		// values from each column are passed into the user variables
		if err := rows.Scan(&thread.ID, &thread.Title, &thread.Content, &thread.CreatedBy, &thread.CreatedAt); err != nil {
			log.Println("Error scanning row:", err)
			continue
		}
		threads = append(threads, thread)
	}
	fmt.Println("Number of threads", len(threads))

	return threads, nil
}

func CreateThread()

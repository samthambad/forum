package services

import (
	"go_backend/database"
	"go_backend/models"
	"log"
)

func GetAllPosts() ([]models.Post, error) {
	query := "SELECT id, title, description, image, created_by, created_at FROM posts;"
	rows, err := database.Db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var post models.Post
		// values from each column are passed into the user variables
		if err := rows.Scan(&post.ID, &post.Title, &post.Description, &post.Image, &post.CreatedBy, &post.CreatedAt); err != nil {
			log.Println("Error scanning row:", err)
			continue
		}
		posts = append(posts, post)
	}

	return posts, nil
}

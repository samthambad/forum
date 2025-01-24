package thread

import (
	"fmt"
	"go_backend/database"
	"go_backend/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllThreads(c *gin.Context) {
	query := "SELECT id, title, content, created_by, created_at FROM threads;"
	rows, err := database.Db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query error"})
		return
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

	c.JSON(http.StatusOK, threads)
}

func GetAllTags(c *gin.Context) {
	query := "SELECT * FROM tags;"
	rows, err := database.Db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query error"})
		return
	}
	var tags []models.Tag
	defer rows.Close()
	for rows.Next() {
		var tag models.Tag
		if err := rows.Scan(&tag.ID, &tag.Name); err != nil {
			log.Println("Error scanning row:", err)
			continue
		}
		tags = append(tags, tag)
	}
	c.JSON(http.StatusOK, tags)
}

func CreateThread(c *gin.Context) {
	var thread models.CreateThreadType
	// convert to the struct value
	if err := c.ShouldBindJSON(&thread); err != nil {
		fmt.Println(thread)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}
	fmt.Println("thread posting:", thread)
	user_id, exists := c.Get("user_id")
	if !exists {
		fmt.Println("Error getting user_id from context")
		return
	}
	user_id_int, ok := user_id.(int)
	if !ok {
		fmt.Println("Error converting user_id to int")
		return
	}
	createQuery := "INSERT INTO threads (title, content, created_by) VALUES ($1, $2, $3);"
	_, err := database.Db.Exec(createQuery, thread.Title, thread.Content, user_id_int)
	if err != nil {
		// Log the error for debugging (do not expose to client)
		fmt.Printf("Database error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create thread"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Thread created successfully"})
}

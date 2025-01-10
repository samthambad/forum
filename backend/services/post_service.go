package services

import (
	"fmt"
	"go_backend/database"
	"go_backend/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetThreads(c *gin.Context) {
	threads, err := GetAllThreads()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch all threads"})
		return
	}
	fmt.Println("Returning", len(threads), "threads")
	c.JSON(http.StatusOK, threads)
}

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

func CreateThread(c *gin.Context) {
	var thread models.CreateThreadType
	// convert to the struct value
	if err := c.ShouldBindJSON(&thread); err != nil {
		fmt.Println(thread)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}
	//TODO
}

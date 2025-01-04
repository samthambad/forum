package controllers

import (
	"fmt"
	"go_backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateThreadType struct {
	Title   string `json:"Title" binding:"required"`
	Content string `json:"Content" binding:"required"`
}

func GetUsers(c *gin.Context) {
	users, err := services.GetAllUsers()
	services.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	c.JSON(http.StatusOK, users)
}

func GetPosts(c *gin.Context) {
	threads, err := services.GetAllThreads()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch all threads"})
		return
	}
	fmt.Println("Returning", len(threads), "threads")
	c.JSON(http.StatusOK, threads)
}

func CreateThread(c *gin.Context) {
	response, err := services.CreateThread()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create thread"})
		return
	}
	// var thread CreateThreadType
	// if err := c.ShouldBindJSON(&thread); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
	// 	return
	// }

	// query := `INSERT INTO threads (title, description) VALUES ($1, $2) RETURNING id`
	// var threadID int
	// if err := db.QueryRow(query, thread.Title, thread.Content).Scan(&threadID); err != nil {
	// 	fmt.Println("Database error:", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert thread into database"})
	// 	return
	// }

	// c.JSON(http.StatusCreated, gin.H{
	// 	"message": "Thread created successfully",
	// 	"id":      threadID,
	// })

}

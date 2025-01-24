package thread

import (
	"encoding/json"
	"fmt"
	"go_backend/database"
	"go_backend/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllThreads(c *gin.Context) {
	query := `
        SELECT 
            t.id, t.title, t.content, t.created_by, t.created_at,
            COALESCE(
                json_agg(
                    json_build_object('id', tg.id, 'name', tg.name)
                ) FILTER (WHERE tg.id IS NOT NULL), 
                '[]'
            ) AS tags
        FROM threads t
        LEFT JOIN thread_tags tt ON t.id = tt.thread_id
        LEFT JOIN tags tg ON tt.tag_id = tg.id
        GROUP BY t.id
    `

	rows, err := database.Db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query error"})
		return
	}
	defer rows.Close()

	var threads []models.Thread
	for rows.Next() {
		var thread models.Thread
		var tagsJSON []byte // To store the raw JSON array of tags

		// Scan the JSON array into `tagsJSON`
		err := rows.Scan(
			&thread.ID,
			&thread.Title,
			&thread.Content,
			&thread.CreatedBy,
			&thread.CreatedAt,
			&tagsJSON,
		)
		if err != nil {
			log.Printf("Error scanning row: %v\n", err)
			continue
		}

		// Unmarshal the JSON array into []models.Tag
		if err := json.Unmarshal(tagsJSON, &thread.Tags); err != nil {
			log.Printf("Error unmarshaling tags: %v\n", err)
			continue
		}

		threads = append(threads, thread)
	}

	fmt.Printf("Number of threads: %d\n", len(threads))
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
	userId, exists := c.Get("user_id")
	if !exists {
		fmt.Println("Error getting user_id from context")
		return
	}
	userIdInt, ok := userId.(int)
	if !ok {
		fmt.Println("Error converting user_id to int")
		return
	}
	// 1. Insert the thread
	threadQuery := `
        INSERT INTO threads (title, content, created_by)
        VALUES ($1, $2, $3) RETURNING id
    `
	var threadID int
	err := database.Db.QueryRow(threadQuery, thread.Title, thread.Content, userIdInt).Scan(&threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create thread"})
		return
	}

	// 2. Validate and link tags
	for _, tag := range thread.ChosenTags {
		// Check if tag exists
		var exists bool
		err := database.Db.QueryRow("SELECT EXISTS(SELECT 1 FROM tags WHERE id = $1)", tag.ID).Scan(&exists)
		if err != nil || !exists {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tag ID"})
			return
		}
		// Link tag to thread
		_, err = database.Db.Query(`
            INSERT INTO thread_tags (thread_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `, threadID, tag.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to link tags"})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{"message": "Thread created successfully"})
}

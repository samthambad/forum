package thread

import (
	"encoding/json"
	"fmt"
	"go_backend/database"
	"go_backend/models"
	"log"
	"net/http"
	"strconv"

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

func CreateComment(c *gin.Context) {
	threadID := c.Param("thread_id")
	userID, _ := c.Get("user_id") // From AuthMiddleware

	var comment models.Comment
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment data"})
		return
	}

	// Convert threadID to int
	threadIDInt, err := strconv.Atoi(threadID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread ID"})
		return
	}

	// Insert comment
	err = database.Db.QueryRow(
		`INSERT INTO comments (content, user_id, thread_id)
         VALUES ($1, $2, $3) RETURNING id, created_at`,
		comment.Content, userID, threadIDInt,
	).Scan(&comment.ID, &comment.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

func GetComments(c *gin.Context) {
	threadID := c.Param("thread_id")

	// joining the users and comments to get the username
	query := `
        SELECT c.id, c.content, c.user_id, c.created_at, u.username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.thread_id = $1
        ORDER BY c.created_at DESC
    `

	rows, err := database.Db.Query(query, threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}
	defer rows.Close()

	var comments []models.CommentWithUser
	for rows.Next() {
		var comment models.CommentWithUser
		err := rows.Scan(
			&comment.ID,
			&comment.Content,
			&comment.UserID,
			&comment.CreatedAt,
			&comment.Username,
		)
		if err != nil {
			log.Printf("Error scanning comment: %v", err)
			continue
		}
		comments = append(comments, comment)
	}

	c.JSON(http.StatusOK, comments)
}

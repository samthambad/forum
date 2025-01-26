package search

import (
	"context"
	"go_backend/database"
	"go_backend/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

func HandleSearch(c *gin.Context) {
	var req models.SearchRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.Limit == 0 {
		req.Limit = 10
	}

	query := `
    SELECT 
        t.id,
        t.title,
        LEFT(t.content, 150) AS excerpt,
        ARRAY_AGG(tags.name) AS tags,  -- still get tag names for display
        t.created_at
    FROM threads t
    LEFT JOIN thread_tags tt ON t.id = tt.thread_id
    LEFT JOIN tags ON tt.tag_id = tags.id
    WHERE 
        (t.title ILIKE '%' || $1 || '%' OR 
         t.content ILIKE '%' || $1 || '%') OR
        tt.tag_id = ANY($2::int[])  -- type casting to int array
    GROUP BY t.id
    ORDER BY t.created_at DESC
    LIMIT $3`
	// context aware queries for timeout etc
	rows, err := database.Db.QueryContext(context.Background(), query,
		req.Query,
		pq.Array(req.Tags),
		req.Limit,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var results []models.SearchResult
	for rows.Next() {
		var result models.SearchResult
		err := rows.Scan(
			&result.ID,
			&result.Title,
			&result.Excerpt,
			&result.Tags,
			&result.CreatedAt,
		)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}
		results = append(results, result)
	}

	c.JSON(http.StatusOK, results)

}

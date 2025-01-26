package search

import (
	"go_backend/database"
	"go_backend/models"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

func HandleSearch(c *gin.Context) {
	query := c.Query("query")
	tagsParam := c.Query("tags")
	limitParam := c.DefaultQuery("limit", "10")

	// Parse input tags
	var inputTags []int
	if tagsParam != "" {
		for _, tag := range strings.Split(tagsParam, ",") {
			tagID, err := strconv.Atoi(tag)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tag ID"})
				return
			}
			inputTags = append(inputTags, tagID)
		}
	}

	// Parse limit
	limit, err := strconv.Atoi(limitParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit"})
		return
	}

	// Execute query
	rows, err := database.Db.Query(`
        SELECT 
		t.id,
		t.title,
		LEFT(t.content, 150) AS excerpt,
		COALESCE(ARRAY_AGG(tags.id) FILTER (WHERE tags.id IS NOT NULL), ARRAY[]::integer[]) AS tags,
		t.created_at
        FROM threads t
        LEFT JOIN thread_tags tt ON t.id = tt.thread_id
        LEFT JOIN tags ON tt.tag_id = tags.id
        WHERE 
            (t.title ILIKE '%' || $1 || '%' OR 
             t.content ILIKE '%' || $1 || '%')
            AND (
                CASE
                    WHEN $2::integer[] IS NULL OR CARDINALITY($2::integer[]) = 0 THEN TRUE
                    ELSE (
                        SELECT COUNT(DISTINCT tt_inner.tag_id) 
                        FROM thread_tags tt_inner 
                        WHERE tt_inner.thread_id = t.id 
                        AND tt_inner.tag_id = ANY($2)
                    ) = CARDINALITY($2::integer[])
                END
            )
        GROUP BY t.id
        ORDER BY t.created_at DESC
        LIMIT $3`,
		query, pq.Array(inputTags), limit,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	// Process results
	var results []models.SearchResult
	for rows.Next() {
		var result models.SearchResult
		var tags []int32 // Use int32 for PostgreSQL integer[]

		err := rows.Scan(
			&result.ID,
			&result.Title,
			&result.Excerpt,
			pq.Array(&tags),
			&result.CreatedAt,
		)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		// Handle empty tags
		if len(tags) == 0 {
			result.Tags = nil
		} else {
			result.Tags = &tags
		}

		results = append(results, result)
	}

	c.JSON(http.StatusOK, results)
}

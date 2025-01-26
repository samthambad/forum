package models

import "time"

type SearchRequest struct {
	Query string `json:"query" form:"query"`
	Tags  []int  `json:"tags" form:"tags"`
	Limit int    `json:"limit" form:"limit"`
}

// SearchResult represents a single search result
type SearchResult struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Excerpt   string    `json:"excerpt"`
	Tags      *[]int32  `json:"tags"` // Use int32 for PostgreSQL integer[]
	CreatedAt time.Time `json:"created_at"`
}

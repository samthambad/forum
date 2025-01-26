package models

type SearchRequest struct {
	Query string `json:"query" form:"query"`
	Tags  []int  `json:"tags" form:"tags"`
	Limit int    `json:"limit" form:"limit"`
}

// SearchResult represents a single search result
type SearchResult struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Excerpt   string `json:"excerpt"`
	Tags      []int  `json:"tags"`
	CreatedAt string `json:"created_at"`
}

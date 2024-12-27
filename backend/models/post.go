package models

import (
	"time"
)

type Post struct {
	ID          int
	Title       string
	Description string
	Image       string
	CreatedBy   int
	CreatedAt   time.Time
}

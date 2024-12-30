package models

import (
	"time"
)

type Post struct {
	ID        int
	Title     string
	Content   string
	CreatedBy int
	CreatedAt time.Time
}

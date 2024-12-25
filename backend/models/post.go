package models

import (
	"database/sql"
	"time"
)

type Post struct {
	ID          int
	Title       string
	Description string
	Image       sql.NullString
	CreatedBy   int
	CreatedAt   time.Time
}

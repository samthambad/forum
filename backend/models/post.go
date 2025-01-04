package models

import (
	"time"
)

type Thread struct {
	ID        int
	Title     string
	Content   string
	CreatedBy int
	CreatedAt time.Time
}

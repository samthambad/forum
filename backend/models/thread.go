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

type CreateThreadType struct {
	Title   string `json:"Title" binding:"required"`
	Content string `json:"Content" binding:"required"`
}

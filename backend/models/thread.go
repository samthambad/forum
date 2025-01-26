package models

import (
	"time"
)

type Thread struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedBy int       `json:"created_by"`
	Username  string    `json: "created_by_username"`
	CreatedAt time.Time `json:"created_at"`
	Tags      []Tag     `json:"tags"`
}

type CreateThreadType struct {
	Title      string `json:"Title" binding:"required"`
	Content    string `json:"Content" binding:"required"`
	ChosenTags []Tag  `json:"ChosenTags" binding:"required"`
}

type Tag struct {
	ID   int    `json:"id" binding:"required"`
	Name string `json:"name" binding:"required"`
}

package models

import "time"

type Comment struct {
	ID        int       `json:"id"`
	Content   string    `json:"content" binding:"required"`
	UserID    int       `json:"user_id"`
	ThreadID  int       `json:"thread_id" binding:"required"`
	CreatedAt time.Time `json:"created_at"`
}

type CommentWithUser struct {
	Comment
	Username string `json:"username"`
}

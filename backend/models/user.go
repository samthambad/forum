package models

type User struct {
	ID    int
	Name  string
	Email string
}

type CreateUserType struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
type LoginUserType struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

package models

type User struct {
	ID    int
	Name  string
	Email string
}

type CreateUserType struct {
	Name     string `json:"Name" binding:"required"`
	Email    string `json:"Email" binding:"required"`
	Password string `json:"Password" binding:"required"`
}

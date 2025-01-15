package user

import (
	"fmt"
	"go_backend/database"
	"go_backend/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(c *gin.Context) {
	users, err := GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	c.JSON(http.StatusOK, users)
}

func GetCurrentUser(c *gin.Context) {

}
func GetAllUsers() ([]models.User, error) {
	query := "SELECT id, username, email FROM users;"
	rows, err := database.Db.Query(query)
	fmt.Println("hello from GetAllUsers", err)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var users []models.User
	for rows.Next() {
		var user models.User
		// values from each column are passed into the user variables
		if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
			log.Println("Error scanning row:", err)
			continue
		}
		users = append(users, user)
	}

	return users, nil
}
func CheckUsername(c *gin.Context) {
	username := c.Query("username") // Get the username from query parameters

	var exists bool
	err := database.Db.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE username = $1)", username).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exists": exists})
}

func CreateUser(c *gin.Context) {
	var user models.CreateUserType
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Hash the password
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}
	// fmt.Println("passwordHash", passwordHash)
	// Insert models.CreateUserType into DB
	_, err = database.Db.Exec("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)", user.Username, user.Email, passwordHash)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code {
			case "23505": // unique_violation
				if pqErr.Constraint == "unique_username" {
					c.JSON(http.StatusBadRequest, gin.H{"message": "Username already exists"})
				}
				if pqErr.Constraint == "unique_email" {
					c.JSON(http.StatusBadRequest, gin.H{"message": "Email already exists"})
				}
			}
		}
	}
}

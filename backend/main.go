package main

import (
	"fmt"
	"go_backend/database"
	"net/http"
	"os"

	"go_backend/middleware"
	"go_backend/thread"
	"go_backend/user"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	router := gin.Default()
	err := godotenv.Load("../.env")
	host := os.Getenv("HOST")
	if err != nil {
		fmt.Println("Error is occurred  on .env file please check")
	}
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{fmt.Sprintf("http://%s:3000", host)},       // Frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},            // Allowed HTTP methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // Allowed headers
		AllowCredentials: true,                                                // Allow cookies if needed
	}))
	database.ConnectDatabase()
	router.GET("/api/all_posts", middleware.AuthMiddleware(), func(c *gin.Context) {
		thread.GetAllThreads(c)
	})
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	router.GET("/api/all_users", user.GetUsers)
	router.POST("/api/create", middleware.AuthMiddleware(), thread.CreateThread)
	router.POST("/api/signUp", user.CreateUser)
	router.POST("/api/login", user.Login)
	router.GET("/api/logout", user.Logout)
	router.Run(":8081")
}

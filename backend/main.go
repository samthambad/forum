package main

import (
	"fmt"
	"go_backend/controllers"
	"go_backend/database"
	"net/http"
	"os"

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
		// AllowOrigins:     []string{"http://localhost:3000"},                   // Frontend URL
		AllowOrigins:     []string{fmt.Sprintf("http://%s:3000", host)},       // Frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},            // Allowed HTTP methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // Allowed headers
		AllowCredentials: true,                                                // Allow cookies if needed
	}))
	database.ConnectDatabase()
	router.GET("/all_posts", controllers.GetPosts)
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	router.GET("/all_users", controllers.GetUsers)
	router.POST("/create, controllers.CreateThread")
	router.Run(":3111") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

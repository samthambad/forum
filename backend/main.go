package main

import (
	"go_backend/controllers"
	"go_backend/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	database.ConnectDatabase()
	router.GET("/")
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	router.GET("/getusers", controllers.GetUsers)
	router.Run(":3111") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

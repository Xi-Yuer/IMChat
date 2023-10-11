package main

import (
	_ "ImChat/src/config"
	"ImChat/src/controllers"
	"ImChat/src/db"
	"ImChat/src/repositories"
	"ImChat/src/routes"
	"ImChat/src/services"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	userRepo := repositories.NewUserRepository(db.DB)
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService)
	routes.SetupRoutes(r, userController)
	r.Run(":8080")
}

// routes/routes.go
package routes

import (
	"ImChat/src/controllers"
	"ImChat/src/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, userController *controllers.UserController) {
	userRoutes := router.Group("/user")
	{
		userRoutes.POST("/register", userController.RegisterUser)
		userRoutes.POST("/login", userController.LoginUser)
		userRoutes.GET("/list", middlewares.Auth(), userController.GetUserList)
	}

}

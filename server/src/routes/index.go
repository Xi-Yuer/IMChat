// routes/routes.go
package routes

import (
	"ImChat/src/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, userController *controllers.UserController) {
	router.POST("/register", userController.RegisterUser)
	router.POST("/login", userController.LoginUser)
}

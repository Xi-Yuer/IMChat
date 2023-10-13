// routes/routes.go
package routes

import (
	"ImChat/src/controllers"
	"ImChat/src/db"
	"ImChat/src/middlewares"
	"ImChat/src/repositories"
	"ImChat/src/services"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	userRoutes := router.Group("/user")
	{
		userRepo := repositories.NewUserRepository(db.DB)
		userService := services.NewUserService(userRepo)
		userController := controllers.NewUserController(userService)
		userRoutes.POST("/register", userController.RegisterUser)
		userRoutes.POST("/login", userController.LoginUser)
		userRoutes.GET("/list", middlewares.Auth(), userController.GetUserList)
		userRoutes.POST("/logout", middlewares.Auth(), userController.Logout)
	}

	chatRoomRoutes := router.Group("/chatroom", middlewares.Auth())
	{
		chatRoomRepo := repositories.NewChatRoomReposotory(db.DB)
		chatRoomService := services.NewChatRoomService(chatRoomRepo)
		chatRoomController := controllers.NewChatRoomController(chatRoomService)
		chatRoomRoutes.POST("/create", chatRoomController.CreateChatRoom)

		userRoomChatRepo := repositories.NewUserRoomChatRepository(db.DB)
		userRoomChatService := services.NewUserChatRoomService(userRoomChatRepo)
		userRoomChatController := controllers.NewUserRoomChatController(userRoomChatService)
		chatRoomRoutes.POST("/join", userRoomChatController.JoinChatRoom)
	}
}

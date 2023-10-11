// controllers/user_controller.go
package controllers

import (
	"ImChat/src/dto"
	"ImChat/src/handlers"
	"ImChat/src/services"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService services.UserService
}

func NewUserController(userService services.UserService) *UserController {
	return &UserController{userService}
}

func (c *UserController) RegisterUser(ctx *gin.Context) {
	var userRegisterDTO dto.UserRegisterDTO
	if err := ctx.ShouldBind(&userRegisterDTO); err != nil {
		// 处理验证错误
		// 返回错误响应
		handlers.Error(ctx, err.Error())
		return
	}

	if err := c.userService.RegisterUser(&userRegisterDTO); err != nil {
		// 处理注册错误
		// 返回错误响应
		handlers.Error(ctx, err.Error())
		return
	}
}

func (c *UserController) LoginUser(ctx *gin.Context) {
	var userLoginDTO dto.UserLoginDTO
	if err := ctx.ShouldBind(&userLoginDTO); err != nil {
		// 处理验证错误
		// 返回错误响应
		handlers.Error(ctx, err.Error())
		return
	}

	userResponse, err := c.userService.LoginUser(&userLoginDTO)
	if err != nil {
		// 处理登录错误
		// 返回错误响应
		handlers.Error(ctx, err.Error())
		return
	}

	// 返回登录成功的用户响应
	ctx.JSON(200, userResponse)
}

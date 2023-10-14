// controllers/user_controller.go
package controllers

import (
	"ImChat/src/dto"
	"ImChat/src/handlers"
	"ImChat/src/services"
	"time"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService services.UserService
}

func NewUserController(userService services.UserService) *UserController {
	return &UserController{userService}
}

// 注册
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

// 登陆
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

// 登出
func (c *UserController) Logout(ctx *gin.Context) {
	account, _ := ctx.Get("account")
	time := time.Now()
	err := c.userService.Logout(account.(string), time)
	if err != nil {
		// 处理退出错误
		// 返回错误响应
		handlers.Error(ctx, err.Error())
		return
	}
	// 返回退出成功的响应
	handlers.Success(ctx, "退出成功", nil)
}

// 请求用户列表
func (c *UserController) GetUserList(ctx *gin.Context) {
	userInfo, err := c.userService.GetUserList()
	if err != nil {
		// 处理获取用户信息错误
		// 返回错误响应
		handlers.Error(ctx, err.Error())
		return
	}
	// 返回用户信息响应
	ctx.JSON(200, userInfo)
}

func (c *UserController) GetUserDetailByID(ctx *gin.Context) {
	userID := ctx.Param("id")
	userInfo, err := c.userService.GetUserDetailByUserID(userID)
	if err != nil {
		// 处理获取用户信息错误
		// 返回错误响应
		handlers.Error(ctx, err.Error())
		return
	}
	// 返回用户信息响应
	ctx.JSON(200, userInfo)
}

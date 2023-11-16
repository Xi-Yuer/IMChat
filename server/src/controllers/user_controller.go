// controllers/user_controller.go
package controllers

import (
	"ImChat/src/config"
	"ImChat/src/db"
	"ImChat/src/dto"
	"ImChat/src/handlers"
	"ImChat/src/models"
	"ImChat/src/repositories"
	"ImChat/src/services"
	"ImChat/src/utils"
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

	user, err := c.userService.RegisterUser(&userRegisterDTO)
	if err != nil {
		// 处理注册错误
		// 返回错误响应
		handlers.Error(ctx, err.Error())
		return
	}
	userRoomChatRecord := &models.UserChatRoom{
		UserID:     user.ID,
		ChatRoomID: config.AppConfig.System.GroupChatID,
	}
	// 用户注册成功默认添加到官方群聊中
	userRoomChatRepo := repositories.NewUserRoomChatRepository(db.DB)
	if err := userRoomChatRepo.JoinChatRoom(userRoomChatRecord); err == nil {
		handlers.Success(ctx, "注册成功", nil)
	}

}

// 登陆
func (c *UserController) Login(ctx *gin.Context) {
	var userLoginDTO dto.UserLoginDTO
	if err := ctx.ShouldBind(&userLoginDTO); err != nil {
		// 处理验证错误
		// 返回错误响应
		handlers.Error(ctx, err.Error())
		return
	}
	// 获取用户的 IP 地址
	ip := ctx.ClientIP()
	userResponse, err := c.userService.Login(&userLoginDTO, ip)
	if err != nil {
		// 处理登录错误
		// 返回错误响应
		handlers.Error(ctx, err.Error())
		return
	}

	// 返回登录成功的用户响应
	handlers.Success(ctx, "登录成功", userResponse)
}

// 登出
func (c *UserController) Logout(ctx *gin.Context) {
	account, _ := ctx.Get("id")
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

// 修改用户资料
func (c *UserController) UpdateUser(ctx *gin.Context) {
	id, ok := ctx.Get("id")
	if !ok {
		handlers.Error(ctx, "非法操作")
		return
	}
	var updateUserDTO dto.UpdateUserRequestDTO
	if err := ctx.ShouldBind(&updateUserDTO); err != nil {
		// 处理参数校验错误
		// 返回错误响应
		handlers.Error(ctx, err.Error())
		return
	}

	if !utils.IsUserSelf(ctx, id.(string)) {
		// 处理参数校验错误
		// 返回错误响应
		handlers.Error(ctx, "非法操作")
		return
	}
	err := c.userService.UpdateUserDetail(&updateUserDTO, id.(string))

	if err != nil {
		handlers.Error(ctx, err.Error())
	}
	user, err := c.userService.GetUserDetailByUserID(id.(string))
	if err == nil {
		handlers.Success(ctx, "修改成功", user)
	} else {
		handlers.Success(ctx, "修改成功", nil)
	}
}

package controllers

import (
	"ImChat/src/handlers"
	"ImChat/src/services"

	"github.com/gin-gonic/gin"
)

type UserRoomChatController struct {
	userRoomChatService services.UserChatRoomService
}

func NewUserRoomChatController(userRoomChatService services.UserChatRoomService) *UserRoomChatController {
	return &UserRoomChatController{userRoomChatService}
}

func (c *UserRoomChatController) JoinChatRoom(ctx *gin.Context) {
	userID, _ := ctx.Get("id")
	roomID := ctx.Query("roomID")
	if roomID == "" {
		handlers.Error(ctx, "roomID is empty")
		return
	}
	err := c.userRoomChatService.JoinChatRoom(userID.(string), roomID)
	if err != nil {
		handlers.Conflict(ctx, err.Error())
		return
	}
	handlers.Success(ctx, "成功加入群聊", nil)
}

func (c *UserRoomChatController) FindChatRoomUsers(ctx *gin.Context) {
	chatRoomID := ctx.Query("chat_room_id")
	if chatRoomID == "" {
		handlers.Error(ctx, "参数错误")
		return
	}
	users, err := c.userRoomChatService.FindChatRoomUsers(chatRoomID)
	if err != nil {
		handlers.Error(ctx, err.Error())
		return
	}
	handlers.Success(ctx, "获取成功", users)
}

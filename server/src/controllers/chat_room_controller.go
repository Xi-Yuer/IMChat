package controllers

import (
	"ImChat/src/dto"
	"ImChat/src/handlers"
	"ImChat/src/services"

	"github.com/gin-gonic/gin"
)

type ChatRoomController struct {
	chatRoomService services.ChatRoomService
}

func NewChatRoomController(chatRoomService services.ChatRoomService) *ChatRoomController {
	return &ChatRoomController{chatRoomService}
}

func (c *ChatRoomController) CreateChatRoom(ctx *gin.Context) {
	var chatRoomCreateDTO dto.CreateChatRoomDTO
	if err := ctx.ShouldBind(&chatRoomCreateDTO); err != nil {
		handlers.Error(ctx, err.Error())
		return
	}
	adminID, _ := ctx.Get("id")
	if err := c.chatRoomService.CreateChatRoom(&chatRoomCreateDTO, adminID.(string)); err != nil {
		handlers.Error(ctx, err.Error())
		return
	}
	handlers.Success(ctx, "创建成功", nil)
}

package controllers

import (
	"ImChat/src/dto"
	"ImChat/src/handlers"
	"ImChat/src/services"

	"github.com/gin-gonic/gin"
)

type MessageController struct {
	messageService services.MessageService
}

func NewMessageController(messageService services.MessageService) *MessageController {
	return &MessageController{messageService}
}

func (c *MessageController) GetChatRoomMessageList(ctx *gin.Context) {
	var dto dto.GetMessageDTO
	if err := ctx.ShouldBind(&dto); err != nil {
		handlers.Error(ctx, err.Error())
		return
	}
	response, err := c.messageService.GetChatRoomMessageList(dto.ChatRoomID, dto.Limit, dto.Offset)
	if err != nil {
		handlers.Error(ctx, err.Error())
		return
	}
	handlers.Success(ctx, "获取成功", response)
}

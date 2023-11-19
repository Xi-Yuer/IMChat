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
	var messageDTO dto.GetMessageDTO
	if err := ctx.ShouldBindQuery(&messageDTO); err != nil {
		handlers.Error(ctx, err.Error())
		return
	}
	response, err := c.messageService.GetChatRoomMessageList(messageDTO.ChatRoomID, messageDTO.Limit, messageDTO.Offset)
	if err != nil {
		handlers.Error(ctx, err.Error())
		return
	}
	handlers.Success(ctx, "获取成功", response)
}

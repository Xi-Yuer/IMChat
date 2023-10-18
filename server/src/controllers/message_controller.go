package controllers

import (
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

type GetMessageDTO struct {
	ChatRoomID string `form:"chat_room_id" json:"chat_room_id"`
	Limit      int    `form:"limit" json:"limit"`
	Offset     int    `form:"offset" json:"offset"`
}

func (c *MessageController) GetChatRoomMessageList(ctx *gin.Context) {
	var dto GetMessageDTO
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

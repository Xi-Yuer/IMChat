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

// 创建消息
func (c *MessageController) CreateMessage(ctx *gin.Context) {
	senderID, _ := ctx.Get("id")
	var createMessageDTO dto.CreateMessageDTO
	err := ctx.ShouldBind(&createMessageDTO)
	if err != nil {
		handlers.Error(ctx, err.Error())
		return
	}

	if err := c.messageService.CreateMessage(&createMessageDTO, senderID.(string)); err != nil {
		handlers.ServerError(ctx, err.Error())
		return
	}
	handlers.Success(ctx, "创建消息成功", nil)
}

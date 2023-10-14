package controllers

import (
	"ImChat/src/services"
)

type MessageController struct {
	messageService services.MessageService
}

func NewMessageController(messageService services.MessageService) *MessageController {
	return &MessageController{messageService}
}

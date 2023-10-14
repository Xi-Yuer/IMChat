package services

import (
	"ImChat/src/dto"
	"ImChat/src/models"
	"ImChat/src/repositories"
)

type MessageService interface {
	CreateMessage(message *dto.CreateMessageDTO, senderID string) error
}

type MessageServiceImpl struct {
	messageRepository repositories.MessageRepository
}

func NewMessageService(messageRepository repositories.MessageRepository) MessageService {
	return &MessageServiceImpl{messageRepository}
}

func (m MessageServiceImpl) CreateMessage(message *dto.CreateMessageDTO, senderID string) error {
	record := &models.Message{
		Content:     message.Content,
		MessageType: message.MessageType,
		SenderID:    senderID,
		ChatRoomID:  message.ReceiverID,
	}
	return m.messageRepository.CreateMessage(record)
}

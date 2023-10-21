package services

import (
	"ImChat/src/dto"
	"ImChat/src/models"
	"ImChat/src/repositories"
)

type MessageService interface {
	CreateMessage(message *dto.CreateMessageDTO, senderID string) error
	GetChatRoomMessageList(chatRoomID string, limit, page int) ([]*dto.ChatMessageResponseDTO, error)
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

func (m MessageServiceImpl) GetChatRoomMessageList(chatRoomID string, limit, page int) ([]*dto.ChatMessageResponseDTO, error) {
	messages, err := m.messageRepository.GetChatRoomMessageList(chatRoomID, limit, page)
	if err != nil {
		return nil, err
	}
	var chatMessageResponseDTOs []*dto.ChatMessageResponseDTO
	for _, message := range messages {
		chatMessageResponseDTO := &dto.ChatMessageResponseDTO{
			User: &dto.UserResponseDTO{
				ID:             message.SenderID,
				Account:        message.Sender.Account,
				Gender:         message.Sender.Gender,
				Bio:            message.Sender.Bio,
				ProfilePicture: message.Sender.ProfilePicture,
				Origin:         message.Sender.Origin,
			},
			Message: &dto.MessageDTO{
				Content:     message.Content,
				MessageType: message.MessageType,
			},
		}

		chatMessageResponseDTOs = append(chatMessageResponseDTOs, chatMessageResponseDTO)
	}
	return chatMessageResponseDTOs, nil
}

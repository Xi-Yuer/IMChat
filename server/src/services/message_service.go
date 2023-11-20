package services

import (
	"ImChat/src/config"
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
	baseUrl := config.AppConfig.DoMian.URL
	for _, message := range messages {
		chatMessageResponseDTO := &dto.ChatMessageResponseDTO{
			User: &dto.UserResponseDTO{
				ID:             message.Sender.ID,
				NickName:       message.Sender.NickName,
				Gender:         message.Sender.Gender,
				Bio:            message.Sender.Bio,
				ProfilePicture: baseUrl + message.Sender.ProfilePicture,
				Origin:         message.Sender.Origin,
			},
			Message: &dto.MessageDTO{
				Content:     message.Content,
				CreatedAt:   message.BaseModel.CreatedAt,
				GroupID:     message.ChatRoom.ID,
				MessageType: message.MessageType,
			},
		}
		chatMessageResponseDTOs = append([]*dto.ChatMessageResponseDTO{chatMessageResponseDTO}, chatMessageResponseDTOs...)
	}
	return chatMessageResponseDTOs, nil
}

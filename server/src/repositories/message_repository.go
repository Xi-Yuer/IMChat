package repositories

import (
	"ImChat/src/models"

	"gorm.io/gorm"
)

type MessageRepository interface {
	CreateMessage(message *models.Message) error
	GetChatRoomMessageList(chatRoomID string, limit, page *int) ([]*models.Message, error)
}

type MessageRepositoryImpl struct {
	db *gorm.DB
}

func NewMessageRepository(db *gorm.DB) *MessageRepositoryImpl {
	return &MessageRepositoryImpl{db}
}

func (r *MessageRepositoryImpl) CreateMessage(message *models.Message) error {
	return r.db.Create(message).Error
}

// 获取群消息聊天列表
func (r *MessageRepositoryImpl) GetChatRoomMessageList(chatRoomID string, limit, page *int) ([]*models.Message, error) {
	var messages []*models.Message
	// 查找最新数据
	if err := r.db.Preload("Sender").Preload("ChatRoom").Where("chat_room_id = ?", chatRoomID).Order("created_at desc").Limit((*limit)).Offset(((*page) - 1) * (*limit)).Find(&messages).Error; err != nil {
		return nil, err
	}
	return messages, nil
}

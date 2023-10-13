package repositories

import (
	"ImChat/src/models"

	"gorm.io/gorm"
)

type ChatRoomRepository interface {
	CreateChatRoom(*models.ChatRoom) error
}

type chatRoomRepository struct {
	db *gorm.DB
}

func NewChatRoomReposotory(db *gorm.DB) ChatRoomRepository {
	return &chatRoomRepository{db}
}

func (r *chatRoomRepository) CreateChatRoom(chatRoom *models.ChatRoom) error {
	// 创建聊天室
	return r.db.Create(chatRoom).Error
}
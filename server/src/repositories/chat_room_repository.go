package repositories

import (
	"ImChat/src/models"

	"gorm.io/gorm"
)

type ChatRoomRepository interface {
	CreateChatRoom(*models.ChatRoom) error
	GetUserRoomListID(userID string) ([]models.UserChatRoom, error)
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

func (r *chatRoomRepository) GetUserRoomListID(userID string) ([]models.UserChatRoom, error) {
	var chatRoomIDList []models.UserChatRoom
	err := r.db.Where("user_id = ?", userID).Find(&chatRoomIDList).Error
	if err != nil {
		return chatRoomIDList, err
	}
	return chatRoomIDList, nil
}

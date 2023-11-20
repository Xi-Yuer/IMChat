package repositories

import (
	"ImChat/src/models"

	"gorm.io/gorm"
)

type ChatRoomRepository interface {
	CreateChatRoom(*models.ChatRoom) error
	GetUserRoomList(userID string) ([]models.ChatRoom, error)
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

func (r *chatRoomRepository) GetUserRoomList(userID string) ([]models.ChatRoom, error) {
	var chatRoomIDList []models.UserChatRoom
	var chatRoomList []models.ChatRoom

	err := r.db.Preload("User").Where("user_id = ?", userID).Find(&chatRoomIDList).Error
	if err != nil {
		return nil, err
	}

	var roomsIDs []string
	for _, v := range chatRoomIDList {
		roomsIDs = append(roomsIDs, v.ChatRoomID)
	}

	if err := r.db.Where("id in (?)", roomsIDs).Find(&chatRoomList).Error; err != nil {
		return chatRoomList, err
	}
	return chatRoomList, nil
}

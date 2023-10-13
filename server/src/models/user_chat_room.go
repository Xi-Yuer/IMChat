package models

import (
	"gorm.io/gorm"
)

type UserChatRoom struct {
	gorm.Model
	UserID     string
	ChatRoomID string

	User     User     `gorm:"foreignKey:UserID"`     // 关联到 User 表的 UserID 字段
	ChatRoom ChatRoom `gorm:"foreignKey:ChatRoomID"` // 关联到 ChatRoom 表的 ChatRoomID 字段
}

func (UserChatRoom) TabelName() string {
	return "user_chat_room"
}

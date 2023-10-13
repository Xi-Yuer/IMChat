package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ChatRoom struct {
	gorm.Model
	ID          string `gorm:"primaryKey;type:char(36)"`
	Name        string `gorm:"type:varchar(255)"`
	Description string `gorm:"type:varchar(255)"`
	AdminID     string `gorm:"type:char(36)"`

	Admin User `gorm:"foreignKey:AdminID"`
}

func (ChatRoom) TabelName() string {
	return "chat_rooms"
}

func (r *ChatRoom) BeforeCreate(tx *gorm.DB) (err error) {
	// 生成唯一的 UUID
	uuid := uuid.New()

	// 将 UUID 分配给 'id' 列
	r.ID = uuid.String()

	return nil
}

package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ChatRoom struct {
	BaseModel
	Name        string `json:"name" gorm:"type:varchar(255)"`
	Description string `json:"description" gorm:"type:varchar(255)"`
	AdminID     string `gorm:"type:char(36)"`
	Avatar      string `json:"avatar" gorm:"type:varchar(255)"`

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

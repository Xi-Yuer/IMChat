package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Message struct {
	BaseModel
	SenderID    string
	Content     string
	MessageType string
	IsDeleted   bool
	DeletedBy   *string // 使用指针类型以允许 NULL 值
	ChatRoomID  string  // 外键字段，表示消息所属的群聊

	Sender    User     `gorm:"foreignKey:SenderID"`
	DeletedID User     `gorm:"foreignKey:DeletedBy"`
	ChatRoom  ChatRoom `gorm:"foreignkey:ChatRoomID"` // 外键关联
}

func (Message) TabelName() string {
	return "message"
}

func (m *Message) BeforeCreate(tx *gorm.DB) (err error) {
	uuid := uuid.New()
	m.ID = uuid.String()
	return nil
}

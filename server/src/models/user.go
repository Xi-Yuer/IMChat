package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID             string `gorm:"primaryKey;type:char(36)"`
	Account        string `gorm:"unique;not null"`
	Password       string `gorm:"not null"`
	Gender         string
	Bio            string
	ProfilePicture string
	LastLogin      *time.Time
	Active         bool
	IsAdmin        bool `gorm:"default:false"`
}

func (User) TabelName() string {
	return "users"
}
func (user *User) BeforeCreate(tx *gorm.DB) (err error) {
	// 生成唯一的 UUID
	uuid := uuid.New()

	// 将 UUID 分配给 'id' 列
	user.ID = uuid.String()

	return nil
}

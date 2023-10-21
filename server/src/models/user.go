package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	BaseModel
	Account        string     `json:"account" gorm:"unique;not null"`
	Password       string     `json:"password" gorm:"not null"`
	Gender         string     `json:"gender"`
	Bio            string     `json:"bio"`
	ProfilePicture string     `json:"profile_picture"`
	LastLogin      *time.Time `json:"last_login"`
	Active         bool       `json:"active"`
	Origin         string     `json:"origin"`
	IsAdmin        bool       `json:"is_admin" gorm:"default:false"`
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

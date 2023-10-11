package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID             uuid.UUID `gorm:"primaryKey;type:binary(16)"`
	Account        string    `gorm:"unique;not null"`
	Password       string    `gorm:"not null"`
	Gender         string
	Bio            string
	ProfilePicture string
	LastLogin      time.Time
	Active         bool
	IsAdmin        bool `gorm:"default:false"`
}

func (User) TabelName() string {
	return "users"
}

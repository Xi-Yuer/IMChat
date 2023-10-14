package repositories

import (
	"ImChat/src/models"

	"gorm.io/gorm"
)

type MessageRepository interface {
	CreateMessage(message *models.Message) error
}

type MessageRepositoryImpl struct {
	db *gorm.DB
}

func NewMessageRepositoryImpl(db *gorm.DB) MessageRepository {
	return &MessageRepositoryImpl{db}
}

func (r *MessageRepositoryImpl) CreateMessage(message *models.Message) error {
	return r.db.Create(message).Error
}

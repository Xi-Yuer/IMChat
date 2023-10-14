package repositories

import (
	"ImChat/src/db"
	"ImChat/src/models"
)

type MessageRepository interface {
	CreateMessage(message *models.Message) error
}

type MessageRepositoryImpl struct {
}

func (r *MessageRepositoryImpl) CreateMessage(message *models.Message) error {
	return db.DB.Create(message).Error
}

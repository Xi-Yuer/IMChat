package dto

import (
	"ImChat/src/models"
	"time"
)

type CreateChatRoomDTO struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
	Avatar      string `json:"avatar" binding:"required"`
}

type ChatRoomResponseDTO struct {
	Name           string      `json:"name"`
	Description    string      `json:"description"`
	CreatedAt      string      `json:"created_at"`
	UpdatedAt      string      `json:"updated_at"`
	Admin          models.User `json:"admin"`
	ID             string      `json:"id"`
	Avatar         string      `json:"avatar"`
	CurrentMsg     string      `json:"current_msg"`
	CurrentMsgTime *time.Time  `json:"current_msg_time"`
}

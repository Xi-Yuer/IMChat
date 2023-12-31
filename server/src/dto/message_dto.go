package dto

import "time"

type CreateMessageDTO struct {
	UserID      string `json:"user_id" binding:"required"`
	Content     string `json:"content" binding:"required"`
	MessageType string `json:"message_type" default:"text"`
	ReceiverID  string `json:"receiver_id" binding:"required"`
}

type MessageResponseDTO struct {
	Type string                 `json:"type"`
	Data ChatMessageResponseDTO `json:"data"`
}
type BaseMessageResponseDTO struct {
	Type string `json:"type"`
}
type ChatMessageResponseDTO struct {
	User    *UserResponseDTO `json:"user"`
	Message *MessageDTO      `json:"message"`
}

type MessageToRoomDTO struct {
	Message     string `json:"message"`
	MessageType string `json:"message_type"`
	FileName    string `json:"file_name"`
	GroupID     string `json:"group"`
}

type MessageDTO struct {
	Content     string    `json:"content"`
	GroupID     string    `json:"group_id"`
	FileName    string    `json:"file_name"`
	MessageType string    `json:"message_type"`
	CreatedAt   time.Time `json:"created_at"`
}

type MessageListResponseDTO struct {
	Messages []MessageResponseDTO `json:"messages"`
}

type GetMessageDTO struct {
	ChatRoomID string `form:"chat_room_id" json:"chat_room_id" binding:"required"`
	Limit      *int   `form:"limit" json:"limit" binding:"required"`
	Offset     *int   `form:"offset" json:"offset" binding:"required"`
}

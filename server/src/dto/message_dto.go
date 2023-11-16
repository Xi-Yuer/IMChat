package dto

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
	GroupID     string `json:"group"`
}

type MessageDTO struct {
	Content     string `json:"content"`
	MessageType string `json:"message_type"`
	CreatedAt   string `json:"created_at"`
}

type MessageListResponseDTO struct {
	Messages []MessageResponseDTO `json:"messages"`
}

type GetMessageDTO struct {
	ChatRoomID string `json:"chat_room_id"`
	Limit      int    `json:"limit"`
	Offset     int    `json:"offset"`
}

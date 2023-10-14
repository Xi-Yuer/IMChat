package dto

type CreateMessageDTO struct {
	UserID      string `form:"user_id" binding:"required"`
	Content     string `form:"content" binding:"required"`
	MessageType string `form:"message_type" default:"text"`
	ReceiverID  string `form:"receiver_id" binding:"required"`
}

type MessageResponseDTO struct {
	User    *UserResponseDTO `json:"user"`
	Message *MessageDTO      `json:"message"`
}

type MessageTypeData struct {
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

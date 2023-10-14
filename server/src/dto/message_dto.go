package dto

type CreateMessageDTO struct {
	UserID      string `form:"user_id" binding:"required"`
	Content     string `form:"content" binding:"required"`
	MessageType string `form:"message_type" default:"text"`
	ReceiverID  string `form:"receiver_id" binding:"required"`
}

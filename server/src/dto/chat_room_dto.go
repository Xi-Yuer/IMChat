package dto

type CreateChatRoomDTO struct {
	Name        string `form:"name" binding:"required"`
	Description string `form:"description" binding:"required"`
}

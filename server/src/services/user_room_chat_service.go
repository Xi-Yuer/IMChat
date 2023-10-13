package services

import (
	"ImChat/src/models"
	"ImChat/src/repositories"
)

type UserChatRoomService interface {
	// 用户加入聊天室
	JoinChatRoom(userId string, chatRoomId string) error
	// 用户离开聊天室
	// LeaveChatRoom(userId string, chatRoomId string) error
	// 查找聊天室的成员
	// FindChatRoomMembers(chatRoomId string) ([]string, error)
}

type userChatRoomService struct {
	userChatRoomRepository repositories.UserRoomChatRepository
}

func NewUserChatRoomService(userChatRoomRepository repositories.UserRoomChatRepository) UserChatRoomService {
	return &userChatRoomService{userChatRoomRepository}
}

func (u *userChatRoomService) JoinChatRoom(userId string, chatRoomId string) error {
	userRoomChatRecord := &models.UserChatRoom{
		UserID:     userId,
		ChatRoomID: chatRoomId,
	}
	return u.userChatRoomRepository.JoinChatRoom(userRoomChatRecord)
}

// func (u *userChatRoomService) LeaveChatRoom(userId string, chatRoomId string) error {
// 	return u.userChatRoomRepository.LeaveChatRoom(userId, chatRoomId)
// }
// func (u *userChatRoomService) FindChatRoomMembers(chatRoomId string) ([]string, error) {
// 	return u.userChatRoomRepository.FindChatRoomMembers(chatRoomId)
// }

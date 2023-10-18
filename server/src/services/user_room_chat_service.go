package services

import (
	"ImChat/src/models"
	"ImChat/src/repositories"
	"errors"
)

type UserChatRoomService interface {
	// 用户加入聊天室
	JoinChatRoom(userId string, chatRoomId string) error
	// 获取聊天室成员
	GetChatRoomUsers(id string) ([]models.User, error)
	// 用户离开聊天室
	// LeaveChatRoom(userId string, chatRoomId string) error
	// 查找聊天室的成员
	// FindChatRoomMembers(chatRoomId string) ([]string, error)
}

type UserChatRoomServiceImpl struct {
	userChatRoomRepository repositories.UserRoomChatRepository
}

func NewUserChatRoomService(userChatRoomRepository repositories.UserRoomChatRepository) UserChatRoomService {
	return &UserChatRoomServiceImpl{userChatRoomRepository}
}

func (u *UserChatRoomServiceImpl) JoinChatRoom(userId string, chatRoomId string) error {
	userRoomChatRecord := &models.UserChatRoom{
		UserID:     userId,
		ChatRoomID: chatRoomId,
	}
	err := u.FindChatRoomUser(userRoomChatRecord)
	if err != nil {
		return u.userChatRoomRepository.JoinChatRoom(userRoomChatRecord)
	}
	// 已加入群聊
	return errors.New("already join the chat room")
}

func (s *UserChatRoomServiceImpl) FindChatRoomUser(record *models.UserChatRoom) error {
	return s.userChatRoomRepository.FindChatRoomUser(record)
}

func (s *UserChatRoomServiceImpl) GetChatRoomUsers(id string) ([]models.User, error) {
	return s.userChatRoomRepository.GetChatRoomUsers(id)
}

// func (u *UserChatRoomServiceImpl) LeaveChatRoom(userId string, chatRoomId string) error {
// 	return u.userChatRoomRepository.LeaveChatRoom(userId, chatRoomId)
// }
// func (u *UserChatRoomServiceImpl) FindChatRoomMembers(chatRoomId string) ([]string, error) {
// 	return u.userChatRoomRepository.FindChatRoomMembers(chatRoomId)
// }

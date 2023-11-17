package services

import (
	"ImChat/src/config"
	"ImChat/src/dto"
	"ImChat/src/models"
	"ImChat/src/repositories"
)

type ChatRoomService interface {
	// 获取聊天室列表
	GetUserRoomList(userID string) ([]dto.ChatRoomResponseDTO, error)

	// 获取聊天室详情
	// GetChatRoomDetail(id string) (*models.ChatRoom, error)

	// 创建聊天室
	CreateChatRoom(dto *dto.CreateChatRoomDTO, adminID string) error

	// 删除聊天室
	// DeleteChatRoom(id string) error

	// 加入聊天室
	// JoinChatRoom(id string) error
}

type ChatRoomServiceImpl struct {
	chatRoomRepository repositories.ChatRoomRepository
}

func NewChatRoomService(chatRoomRepository repositories.ChatRoomRepository) ChatRoomService {
	return &ChatRoomServiceImpl{chatRoomRepository}
}

func (s *ChatRoomServiceImpl) CreateChatRoom(dto *dto.CreateChatRoomDTO, adminID string) error {
	chatRoom := &models.ChatRoom{
		Name:        dto.Name,
		Description: dto.Description,
		AdminID:     adminID,
		Avatar:      dto.Avatar,
	}
	return s.chatRoomRepository.CreateChatRoom(chatRoom)
}

func (s *ChatRoomServiceImpl) GetUserRoomList(userID string) ([]dto.ChatRoomResponseDTO, error) {
	rooms, err := s.chatRoomRepository.GetUserRoomList(userID)
	if err != nil {
		return nil, err
	}
	var RoomList []dto.ChatRoomResponseDTO
	baseUrl := config.AppConfig.DoMian.URL
	for _, room := range rooms {
		RoomList = append(RoomList, dto.ChatRoomResponseDTO{
			ID:             room.ID,
			Name:           room.Name,
			Avatar:         baseUrl + room.Avatar,
			Description:    room.Description,
			CurrentMsg:     room.CurrentMsg,
			CurrentMsgTime: room.CurrentMsgTime,
		})
	}
	return RoomList, nil
}

package repositories

import (
	"ImChat/src/dto"
	"ImChat/src/models"
	"sort"

	"gorm.io/gorm"
)

type UserRoomChatRepository interface {
	JoinChatRoom(record *models.UserChatRoom) error
	FindChatRoomUser(record *models.UserChatRoom) error
	FindUserChatRoom(id string) ([]models.UserChatRoom, error)
	FindChatRoomUsers(id string) ([]dto.ChatRoomUserListResponseDTO, error)
}

func NewUserRoomChatRepository(db *gorm.DB) UserRoomChatRepository {
	return &userRoomChatRepository{db}
}

type userRoomChatRepository struct {
	db *gorm.DB
}

func (r *userRoomChatRepository) JoinChatRoom(record *models.UserChatRoom) error {
	return r.db.Create(record).Error
}

func (r *userRoomChatRepository) FindChatRoomUser(record *models.UserChatRoom) error {
	return r.db.Where(record).First(record).Error
}

func (r *userRoomChatRepository) FindUserChatRoom(id string) ([]models.UserChatRoom, error) {
	var records []models.UserChatRoom
	err := r.db.Where("user_id = ?", id).Find(&records).Error
	return records, err
}

func (r *userRoomChatRepository) FindChatRoomUsers(chatRoomId string) ([]dto.ChatRoomUserListResponseDTO, error) {
	var users []models.User

	// 查询 UserChatRoom 表，找到与特定 ChatRoomID 相关的用户ID
	var userChatRooms []models.UserChatRoom
	if err := r.db.Where("chat_room_id = ?", chatRoomId).Find(&userChatRooms).Error; err != nil {
		return nil, err
	}

	// 提取用户ID
	var userIDs []string
	for _, uc := range userChatRooms {
		userIDs = append(userIDs, uc.UserID)
	}

	// 查询用户表，找到与提取的用户ID相关的用户
	if err := r.db.Where("id IN (?)", userIDs).Find(&users).Error; err != nil {
		return nil, err
	}
	// 根据用户的在线状态进行排序
	sort.Slice(users, func(i, j int) bool {
		return users[i].Active && !users[j].Active
	})

	var response []dto.ChatRoomUserListResponseDTO
	for _, user := range users {
		response = append(response, dto.ChatRoomUserListResponseDTO{
			ID:             user.ID,
			Gender:         user.Gender,
			Bio:            user.Bio,
			ProfilePicture: user.ProfilePicture,
			LastLogin:      user.LastLogin,
			Active:         user.Active,
			IsAdmin:        user.IsAdmin,
		})
	}

	return response, nil
}

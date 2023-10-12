// services/user_service.go
package services

import (
	"ImChat/src/config"
	"ImChat/src/dto"
	"ImChat/src/models"
	"ImChat/src/repositories"
	"ImChat/src/utils"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type UserService interface {
	RegisterUser(dto *dto.UserRegisterDTO) error
	LoginUser(dto *dto.UserLoginDTO) (*dto.UserLoginResponseDTO, error)
	GetUserList() ([]*dto.UserResponseDTO, error)
	Logout(account string, time time.Time) error
}

type userService struct {
	userRepository repositories.UserRepository
}

func NewUserService(userRepository repositories.UserRepository) UserService {
	return &userService{userRepository}
}

func (s *userService) RegisterUser(dto *dto.UserRegisterDTO) error {

	password, err := utils.HashPassword(dto.Password)
	if err != nil {
		return err
	}
	user := &models.User{
		Account:  dto.Account,
		Password: password,
	}
	return s.userRepository.CreateUser(user)
}

func (s *userService) LoginUser(loginDto *dto.UserLoginDTO) (*dto.UserLoginResponseDTO, error) {

	user := &models.User{
		Account: loginDto.Account,
	}

	u, err := s.userRepository.GetUserByAccount(user.Account)
	if err != nil {
		return nil, err
	}

	if err := utils.IsPasswordValid(loginDto.Password, u.Password); err != nil {
		return nil, err
	}

	claims := jwt.MapClaims{
		"account": u.Account, // 用户名或其他身份信息
		"id":      u.ID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // 令牌过期时间
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	if err != nil {
		return nil, err
	}
	tokenString, err := token.SignedString([]byte(config.SecretKey))

	if err != nil {
		return nil, err
	}
	return &dto.UserLoginResponseDTO{
		ID:      u.ID,
		Account: u.Account,
		Token:   tokenString,
	}, nil
}

func (s *userService) Logout(account string, time time.Time) error {
	err := s.userRepository.Logout(account, time)
	if err != nil {
		return err
	}
	return nil
}

func (s *userService) GetUserList() ([]*dto.UserResponseDTO, error) {
	users, err := s.userRepository.GetUserList()
	if err != nil {
		return nil, err
	}
	list := make([]*dto.UserResponseDTO, len(users))
	for i, user := range users {
		list[i] = &dto.UserResponseDTO{
			ID:      user.ID,
			Account: user.Account,
		}
	}
	return list, nil
}

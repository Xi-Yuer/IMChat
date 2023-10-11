// services/user_service.go
package services

import (
	"ImChat/src/dto"
	"ImChat/src/models"
	"ImChat/src/repositories"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	RegisterUser(dto *dto.UserRegisterDTO) error
	LoginUser(dto *dto.UserLoginDTO) (*dto.UserResponseDTO, error)
}

type userService struct {
	userRepository repositories.UserRepository
}

func NewUserService(userRepository repositories.UserRepository) UserService {
	return &userService{userRepository}
}

func (s *userService) RegisterUser(dto *dto.UserRegisterDTO) error {
	// Hash用户密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &models.User{
		Account:  dto.Account,
		Password: string(hashedPassword),
	}
	return s.userRepository.CreateUser(user)
}

func (s *userService) LoginUser(loginDto *dto.UserLoginDTO) (*dto.UserResponseDTO, error) {

	user := &models.User{
		Account: loginDto.Account,
	}

	u, err := s.userRepository.GetUserByAccount(user.Account)
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginDto.Password))
	if err != nil {
		return nil, err
	}

	return &dto.UserResponseDTO{
		ID:      u.ID,
		Account: u.Account,
	}, nil
}

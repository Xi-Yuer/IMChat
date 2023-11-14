// services/user_service.go
package services

import (
	"ImChat/src/config"
	"ImChat/src/dto"
	"ImChat/src/https"
	"ImChat/src/models"
	"ImChat/src/repositories"
	"ImChat/src/utils"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type UserService interface {
	RegisterUser(dto *dto.UserRegisterDTO) error
	Login(dto *dto.UserLoginDTO, ip string) (*dto.UserLoginResponseDTO, error)
	GetUserList() ([]*dto.UserResponseDTO, error)
	Logout(account string, time time.Time) error
	GetUserDetailByUserID(userID string) (*dto.UserResponseDTO, error)
	UpdateUserDetail(userDetail *dto.UpdateUserRequestDTO, id string) error
}

type UserServiceImpl struct {
	userRepository repositories.UserRepository
}

func NewUserService(userRepository repositories.UserRepository) UserService {
	return &UserServiceImpl{userRepository}
}

// 注册
func (s *UserServiceImpl) RegisterUser(dto *dto.UserRegisterDTO) error {
	avatarList := [...]string{
		"https://xiyuer.club/system/%E5%A4%B4%E5%83%8F%20%E8%81%8C%E5%9C%BA%E7%94%B7%E5%A3%AB.png",
		"https://xiyuer.club/system/%E5%A4%B4%E5%83%8F%20%E4%B8%AD%E9%95%BF%E5%8F%91%E5%A5%B3%E5%AD%A9.png",
		"https://xiyuer.club/system/%E5%A4%B4%E5%83%8F%20%E5%8F%8C%E9%A9%AC%E5%B0%BE%E5%A5%B3%E5%AD%A9.png",
		"https://xiyuer.club/system/%E5%A4%B4%E5%83%8F%20%E5%95%86%E5%8A%A1%E7%94%B7%E4%BA%BA.png",
		"https://xiyuer.club/system/%E5%A4%B4%E5%83%8F%20%E5%A4%A7%E8%83%A1%E5%AD%90%E7%94%B7%E5%A3%AB.png",
		"https://xiyuer.club/system/%E5%A4%B4%E5%83%8F%20%E9%98%B3%E5%85%89%E7%94%B7%E7%94%9F.png",
	}
	password, err := utils.HashPassword(dto.Password)
	if err != nil {
		return err
	}
	user := &models.User{
		Account:        dto.Account,
		Password:       password,
		ProfilePicture: avatarList[dto.AvatarID],
	}
	return s.userRepository.CreateUser(user)
}

// 登陆
func (s *UserServiceImpl) Login(loginDto *dto.UserLoginDTO, ip string) (*dto.UserLoginResponseDTO, error) {

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
	locationStr := https.GetUserOriginByIP(ip)
	go s.userRepository.Login(u.ID, locationStr)
	return &dto.UserLoginResponseDTO{
		ID:             u.ID,
		Account:        u.Account,
		Token:          tokenString,
		ProfilePicture: u.ProfilePicture,
		Gender:         u.Gender,
		Bio:            u.Bio,
	}, nil
}

// 登出
func (s *UserServiceImpl) Logout(account string, time time.Time) error {
	err := s.userRepository.Logout(account, time)
	if err != nil {
		return err
	}
	return nil
}

// 获取用户列表
func (s *UserServiceImpl) GetUserList() ([]*dto.UserResponseDTO, error) {
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

func (s *UserServiceImpl) GetUserDetailByUserID(id string) (*dto.UserResponseDTO, error) {
	user, err := s.userRepository.GetUserDetailByUserID(id)
	if err != nil {
		return nil, err
	}
	return &dto.UserResponseDTO{
		ID:      user.ID,
		Account: user.Account,
	}, nil
}

// 修改用户资料
func (s *UserServiceImpl) UpdateUserDetail(user *dto.UpdateUserRequestDTO, id string) error {

	u, err := s.userRepository.GetUserDetailByUserID(id)
	if err != nil {
		return err
	}
	// 有值就修改，没有就保持原值
	if user.Account != "" {
		u.Account = user.Account
	}
	if user.Password != "" {
		password, err := utils.HashPassword(user.Password)
		if err != nil {
			return err
		}
		u.Password = password
	}
	if user.Gender != "" {
		u.Gender = user.Gender
	}
	if user.Bio != "" {
		u.Bio = user.Bio
	}
	if user.ProfilePicture != "" {
		u.ProfilePicture = user.ProfilePicture
	}
	if err := s.userRepository.UpdateUserDetail(u); err != nil {
		return err
	}
	return nil
}

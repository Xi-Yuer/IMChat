// repositories/user_repository.go
package repositories

import (
	"ImChat/src/models"
	"time"

	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(user *models.User) error
	GetUserByAccount(account string) (*models.User, error)
	GetUserList() ([]*models.User, error)
	GetUserDetailByUserID(userID string) (*models.User, error)
	Login(id string, location string) error
	Logout(account string, time time.Time) error
	UpdateUserDetail(user *models.User) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db}
}

// CreateUser 创建用户(注册)
func (r *userRepository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

// GetUserByAccount 获取用户账号信息
func (r *userRepository) GetUserByAccount(account string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("account = ?", account).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserDetailByUserID 查询用户详情
func (r *userRepository) GetUserDetailByUserID(userID string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// Logout 登出
func (r *userRepository) Logout(id string, time time.Time) error {
	return r.db.Model(&models.User{}).Where("id = ?", id).Update("last_login", time).Update("active", false).Error
}

// Login 登录
func (r *userRepository) Login(id string, location string) error {
	return r.db.Model(&models.User{}).Where("id = ?", id).Update("active", true).Update("origin", location).Error
}

// GetUserList 获取用户列表
func (r *userRepository) GetUserList() ([]*models.User, error) {
	var userList []*models.User
	if err := r.db.Find(&userList).Error; err != nil {
		return nil, err
	}
	return userList, nil
}

func (r *userRepository) UpdateUserDetail(user *models.User) error {
	return r.db.Model(&models.User{}).Where("id = ?", user.ID).Updates(user).Error
}

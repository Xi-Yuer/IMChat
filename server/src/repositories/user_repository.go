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
	Logout(account string, time time.Time) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db}
}

func (r *userRepository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) GetUserByAccount(account string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("account = ?", account).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// 退出登陆
func (r *userRepository) Logout(account string, time time.Time) error {
	return r.db.Model(&models.User{}).Where("account = ?", account).Update("last_login", time).Error
}

func (r *userRepository) GetUserList() ([]*models.User, error) {
	var userList []*models.User
	if err := r.db.Find(&userList).Error; err != nil {
		return nil, err
	}
	return userList, nil
}

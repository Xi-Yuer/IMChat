// repositories/user_repository.go
package repositories

import (
	"ImChat/src/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(user *models.User) error
	GetUserByAccount(account string) (*models.User, error)
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


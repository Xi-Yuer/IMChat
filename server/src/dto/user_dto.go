// dto/user_dto.go
package dto

import "github.com/google/uuid"

type UserRegisterDTO struct {
	Account  string `json:"account" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UserLoginDTO struct {
	Account  string `json:"account" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UserResponseDTO struct {
	ID      uuid.UUID `json:"id"`
	Account string    `json:"account"`
	// 其他字段...
}

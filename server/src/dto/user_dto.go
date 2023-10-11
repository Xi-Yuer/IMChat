// dto/user_dto.go
package dto

type UserRegisterDTO struct {
	Account  string `form:"account" binding:"required"`
	Password string `form:"password" binding:"required"`
}

type UserLoginDTO struct {
	Account  string `form:"account" binding:"required"`
	Password string `form:"password" binding:"required"`
}

type UserResponseDTO struct {
	ID      string `json:"id"`
	Account string `json:"account"`
	// 其他字段...
}

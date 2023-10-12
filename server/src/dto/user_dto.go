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

type UserLoginResponseDTO struct {
	ID      string `json:"id"`
	Account string `json:"account"`
	Token   string `json:"token"`
	// 其他字段...
}

type UserResponseDTO struct {
	ID      string `json:"id"`
	Account string `json:"account"`
	Gender  string `json:"gender"`
	Bio     string `json:"bio"`
}

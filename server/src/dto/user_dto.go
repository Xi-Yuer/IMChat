// dto/user_dto.go
package dto

import "time"

type UserRegisterDTO struct {
	Account  string `form:"account" binding:"required"`
	Password string `form:"password" binding:"required"`
	AvatarID int64  `form:"avatar_id" default:"1"`
}

type UserLoginDTO struct {
	Account  string `form:"account" binding:"required"`
	Password string `form:"password" binding:"required"`
}

type UserLoginResponseDTO struct {
	ID             string `json:"id"`
	Account        string `json:"account"`
	Token          string `json:"token"`
	ProfilePicture string `json:"profile_picture"`
	// 其他字段...
}

type UserResponseDTO struct {
	ID             string     `json:"id"`
	Account        string     `json:"account"`
	Gender         string     `json:"gender"`
	Bio            string     `json:"bio"`
	Origin         string     `json:"origin"`
	ProfilePicture string     `json:"profile_picture"`
	LastLogin      *time.Time `json:"last_login"`
}

type ChatRoomUserListResponseDTO struct {
	ID             string     `json:"id"`
	Account        string     `json:"account"`
	Gender         string     `json:"gender"`
	Bio            string     `json:"bio"`
	ProfilePicture string     `json:"profile_picture"`
	LastLogin      *time.Time `json:"last_login"`
	Active         bool       `json:"active"`
	IsAdmin        bool       `json:"is_admin"`
}

type OriginData struct {
	Data []Origin `json:"data"`
}

type Origin struct {
	Location string `json:"location"`
}

type UpdateUserRequestDTO struct {
	Account        string `form:"account"`
	Gender         string `form:"gender"`
	Bio            string `form:"bio"`
	Password       string `form:"password"`
	ProfilePicture string `form:"profile_picture"`
}

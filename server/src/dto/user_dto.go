// dto/user_dto.go
package dto

import "time"

type UserRegisterDTO struct {
	Account  string `json:"account" binding:"required"`
	Password string `json:"password" binding:"required"`
	NickName string `json:"nick_name" binding:"required"`
	AvatarID *int64 `json:"avatar_id" binding:"required"`
}

type UserLoginDTO struct {
	Account  string `json:"account" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UserLoginResponseDTO struct {
	ID             string     `json:"id"`
	Gender         string     `json:"gender"`
	Bio            string     `json:"bio"`
	Origin         string     `json:"origin"`
	NickName       string     `json:"nick_name"`
	ProfilePicture string     `json:"profile_picture"`
	LastLogin      *time.Time `json:"last_login"`
	Token          string     `json:"token"`
}

type UserResponseDTO struct {
	ID             string     `json:"id"`
	Gender         string     `json:"gender"`
	Bio            string     `json:"bio"`
	Origin         string     `json:"origin"`
	NickName       string     `json:"nick_name"`
	ProfilePicture string     `json:"profile_picture"`
	LastLogin      *time.Time `json:"last_login"`
}

type ChatRoomUserListResponseDTO struct {
	ID             string     `json:"id"`
	Gender         string     `json:"gender"`
	NickName       string     `json:"nick_name"`
	Bio            string     `json:"bio"`
	ProfilePicture string     `json:"profile_picture"`
	LastLogin      *time.Time `json:"last_login"`
	Active         bool       `json:"active"`
	IsAdmin        bool       `json:"is_admin"`
}

type OriginData struct {
	Data Origin `json:"data"`
}

type Origin struct {
	Area string `json:"area"`
}

type UpdateUserRequestDTO struct {
	NickName       string `json:"nick_name"`
	Gender         string `json:"gender"`
	Bio            string `json:"bio"`
	Password       string `json:"password"`
	ProfilePicture string `json:"profile_picture"`
}

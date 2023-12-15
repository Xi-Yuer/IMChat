package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type File struct {
	BaseModel
	FileName   string `json:"file_name"`
	FileSize   int64  `json:"file_size"`
	FileType   string `json:"file_type"`
	FileUrl    string `json:"file_url"`
	FileSender string `json:"file_sender"`
	FileWidth  string `json:"file_width"`
	FileHeight string `json:"file_height"`

	User User `gorm:"foreignKey:FileSender"` // 关联到 User 表的 UserID 字段
}

func (*File) TabelName() string {
	return "files"
}
func (file *File) BeforeCreate(*gorm.DB) (err error) {
	// 生成唯一的 UUID
	u := uuid.New()

	// 将 UUID 分配给 'id' 列
	file.ID = u.String()

	return nil
}

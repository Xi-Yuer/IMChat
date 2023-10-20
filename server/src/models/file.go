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

	User User `gorm:"foreignKey:FileSender"` // 关联到 User 表的 UserID 字段
}

func (File) TabelName() string {
	return "files"
}
func (file *File) BeforeCreate(tx *gorm.DB) (err error) {
	// 生成唯一的 UUID
	uuid := uuid.New()

	// 将 UUID 分配给 'id' 列
	file.ID = uuid.String()

	return nil
}

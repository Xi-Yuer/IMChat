package repositories

import (
	"ImChat/src/models"

	"gorm.io/gorm"
)

type FileRepository interface {
	UploadFile(file *models.File) (err error)
}

type FileRepositoryImpl struct {
	db *gorm.DB
}

func NewFileRepository(db *gorm.DB) *FileRepositoryImpl {
	return &FileRepositoryImpl{db}
}

// UploadFile 返回插入的数据
func (r *FileRepositoryImpl) UploadFile(file *models.File) (err error) {
	return r.db.Create(file).Error
}

// GetFile 根据文件 ID 获取文件
func (r *FileRepositoryImpl) GetFile(fileId string) (file *models.File, err error) {
	result := r.db.Where("id = ?", fileId).First(&file)
	if result.Error != nil {
		return nil, result.Error
	}
	return file, nil
}

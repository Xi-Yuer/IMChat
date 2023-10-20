package services

import (
	"ImChat/src/config"
	"ImChat/src/dto"
	"ImChat/src/models"
	"ImChat/src/repositories"
	"fmt"
	"mime/multipart"
	"os"
	"strings"

	"github.com/aliyun/aliyun-oss-go-sdk/oss"
	"github.com/google/uuid"
)

type FileService interface {
	UploadFile(fileData *multipart.FileHeader, sender string) (file *dto.FileResposeDTO, err error)
}

func NewFileService(fileRepository repositories.FileRepository) FileService {
	return &FileServiceImpl{fileRepository}
}

type FileServiceImpl struct {
	fileRepository repositories.FileRepository
}

// UploadFile 上传文件
func (f *FileServiceImpl) UploadFile(fileData *multipart.FileHeader, sender string) (file *dto.FileResposeDTO, err error) {
	fileURL, err := UploadAliyunOss(fileData)
	if err != nil {
		return nil, err
	}
	record := &models.File{
		FileName:   fileData.Filename,
		FileSize:   fileData.Size,
		FileType:   fileData.Header.Get("Content-Type"),
		FileUrl:    fileURL,
		FileSender: sender,
	}
	f.fileRepository.UploadFile(record)
	if err := f.fileRepository.UploadFile(record); err != nil {
		return nil, err
	}
	response := &dto.FileResposeDTO{
		ID:         record.ID,
		FileName:   record.FileName,
		FileType:   record.FileType,
		FileSize:   record.FileSize,
		FileUrl:    record.FileUrl,
		FileSender: record.FileSender,
	}
	return response, nil
}

// 将文件上传到 阿里云 oss
func UploadAliyunOss(file *multipart.FileHeader) (string, error) {
	AppConfig := config.AppConfig
	client, err := oss.New(AppConfig.Aliyun.Endpoint, AppConfig.Aliyun.AccessKeyID, AppConfig.Aliyun.AccessKeySecret)
	if err != nil {
		fmt.Println("Error:", err)
		os.Exit(-1)
		return "", err
	}
	// 指定bucket
	bucket, err := client.Bucket(AppConfig.Aliyun.BucketName) // 根据自己的填写
	if err != nil {
		fmt.Println("Error:", err)
		os.Exit(-1)
		return "", err
	}

	src, err := file.Open()
	if err != nil {
		fmt.Println("Error:", err)
		os.Exit(-1)
		return "", err
	}
	defer src.Close()

	// 将文件流上传至bucket目录下
	fileID := uuid.New().String()
	fileExt := file.Filename[strings.LastIndex(file.Filename, "."):]
	err = bucket.PutObject(fileID+fileExt, src)
	if err != nil {
		fmt.Println("Error:", err)
		os.Exit(-1)
		return "", err
	}
	return fileID + fileExt, nil
}

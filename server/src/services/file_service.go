package services

import (
	"ImChat/src/config"
	"ImChat/src/dto"
	"ImChat/src/models"
	"ImChat/src/repositories"
	"mime/multipart"
	"strings"

	"github.com/aliyun/aliyun-oss-go-sdk/oss"
	"github.com/google/uuid"
)

type FileService interface {
	UploadFile(fileData *multipart.FileHeader, sender, width, height string) (file *dto.FileResposeDTO, err error)
}

func NewFileService(fileRepository repositories.FileRepository) FileService {
	return &FileServiceImpl{fileRepository}
}

type FileServiceImpl struct {
	fileRepository repositories.FileRepository
}

// UploadFile 上传文件
func (f *FileServiceImpl) UploadFile(fileData *multipart.FileHeader, sender, width, height string) (file *dto.FileResposeDTO, err error) {
	fileURL, err := UploadAliyunOss(fileData)
	if err != nil {
		return nil, err
	}
	record := &models.File{
		FileName:   fileData.Filename,
		FileSize:   fileData.Size,
		FileWidth:  width,
		FileHeight: height,
		FileType:   fileData.Header.Get("Content-Type"),
		FileUrl:    fileURL + "?width=" + width + "&height=" + height,
		FileSender: sender,
	}
	if err := f.fileRepository.UploadFile(record); err != nil {
		return nil, err
	}
	response := &dto.FileResposeDTO{
		ID:         record.ID,
		FileName:   record.FileName,
		FileType:   record.FileType,
		FileSize:   record.FileSize,
		FileWidth:  record.FileWidth,
		FileHeight: record.FileHeight,
		FileUrl:    config.AppConfig.Aliyun.BucketURL + record.FileUrl,
		FileSender: record.FileSender,
	}
	return response, nil
}

// 图片消息：用户选择图片之后，由后端上传图片至OSS平台，上传成功之后返回图片相关信息给到前端，前端拿到图片信息之后再向群聊中发送一条消息，消息类型为图片类型，将消息存储到消息内存变量中并进行渲染

// UploadAliyunOss 将文件上传到 阿里云 oss
func UploadAliyunOss(file *multipart.FileHeader) (string, error) {
	AppConfig := config.AppConfig
	client, err := oss.New(AppConfig.Aliyun.Endpoint, AppConfig.Aliyun.AccessKeyID, AppConfig.Aliyun.AccessKeySecret)
	if err != nil {
		return "", err
	}
	// 指定bucket
	bucket, err := client.Bucket(AppConfig.Aliyun.BucketName) // 根据自己的填写
	if err != nil {
		return "", err
	}

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer func(src multipart.File) {
		err := src.Close()
		if err != nil {

		}
	}(src)

	// 将文件流上传至bucket目录下
	fileID := uuid.New().String()
	fileExt := file.Filename[strings.LastIndex(file.Filename, "."):]
	err = bucket.PutObject(fileID+fileExt, src)
	if err != nil {
		return "", err
	}
	return fileID + fileExt, nil
}

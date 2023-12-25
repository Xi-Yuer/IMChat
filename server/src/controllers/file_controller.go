package controllers

import (
	"ImChat/src/handlers"
	"ImChat/src/services"
	"ImChat/src/utils"
	"github.com/gin-gonic/gin"
	"strconv"
)

type FileController struct {
	fileService services.FileService
}

func NewFileController(fileService services.FileService) *FileController {
	return &FileController{fileService}
}

func (c *FileController) UploadFile(ctx *gin.Context) {
	sender, ok := ctx.Get("id")
	if !ok {
		handlers.NoAuth(ctx)
		return
	}
	// 获取文件
	file, err := ctx.FormFile("file")
	// 获取文件信息
	width := ctx.PostForm("width")
	height := ctx.PostForm("height")
	// 判断文件类型
	fileType := file.Header.Get("Content-Type")
	// 图片类型的文件
	var result *utils.MediaRect
	if width != "" && height != "" {
		w, _ := strconv.Atoi(width)
		h, _ := strconv.Atoi(height)
		result = &utils.MediaRect{
			Width:  w,
			Height: h,
		}
	}
	if fileType == "image/jpeg" || fileType == "image/png" || fileType == "image/gif" {
		// 处理图片
		ImageRect, err := utils.HandelImageUplaod(file)
		result = ImageRect
		if err != nil {
			panic(err)
		}
	}
	if err != nil {
		panic(err)
	}
	if err != nil {
		handlers.Error(ctx, err.Error())
		return
	}

	if record, err := c.fileService.UploadFile(file, sender.(string), strconv.Itoa(result.Width), strconv.Itoa(result.Height)); err != nil {
		handlers.Error(ctx, err.Error())
	} else {
		handlers.Success(ctx, "success", record)
	}
}

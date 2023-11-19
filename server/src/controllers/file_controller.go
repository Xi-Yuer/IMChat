package controllers

import (
	"ImChat/src/handlers"
	"ImChat/src/services"

	"github.com/gin-gonic/gin"
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
	if err != nil {
		handlers.Error(ctx, err.Error())
		return
	}

	if record, err := c.fileService.UploadFile(file, sender.(string)); err != nil {
		handlers.Error(ctx, err.Error())
	} else {
		handlers.Success(ctx, "success", record)
	}
}

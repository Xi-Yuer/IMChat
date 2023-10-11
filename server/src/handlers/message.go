package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Error(ctx *gin.Context, msg string) {
	ctx.JSON(http.StatusBadRequest, gin.H{
		"msg":  msg,
		"code": http.StatusBadRequest,
	})
}

func Success(ctx *gin.Context, msg string, data interface{}) {
	ctx.JSON(http.StatusOK, gin.H{
		"msg":  msg,
		"code": http.StatusOK,
		"data": data,
	})
}

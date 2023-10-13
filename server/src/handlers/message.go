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

func NoAuth(ctx *gin.Context) {
	ctx.JSON(http.StatusUnauthorized, gin.H{
		"msg":  "未登录",
		"code": http.StatusUnauthorized,
	})
}

func NoPermission(ctx *gin.Context) {
	ctx.JSON(http.StatusForbidden, gin.H{
		"msg":  "无权限",
		"code": http.StatusForbidden,
	})
}

func NotFound(ctx *gin.Context) {
	ctx.JSON(http.StatusNotFound, gin.H{
		"msg":  "未找到",
		"code": http.StatusNotFound,
	})
}

func ServerError(ctx *gin.Context, msg string) {
	ctx.JSON(http.StatusInternalServerError, gin.H{
		"msg":  msg,
		"code": http.StatusInternalServerError,
	})
}

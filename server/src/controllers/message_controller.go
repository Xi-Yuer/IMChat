package controllers

import (
	"ImChat/src/dto"
	"ImChat/src/handlers"
	"ImChat/src/redis"
	"ImChat/src/services"
	"encoding/json"
	"github.com/gin-gonic/gin"
)

type MessageController struct {
	messageService services.MessageService
}

func NewMessageController(messageService services.MessageService) *MessageController {
	return &MessageController{messageService}
}

func (c *MessageController) GetChatRoomMessageList(ctx *gin.Context) {
	var messageDTO dto.GetMessageDTO
	if err := ctx.ShouldBindQuery(&messageDTO); err != nil {
		handlers.Error(ctx, err.Error())
		return
	}
	// 先从 Redis 中获取数据
	responseStr, err := redis.LRange(messageDTO.ChatRoomID, int64(*messageDTO.Offset), int64((*messageDTO.Offset)+(*messageDTO.Limit)-1))
	var redisMessages []*dto.ChatMessageResponseDTO
	if err == nil {
		for _, v := range responseStr {
			var redisMessageSlice *dto.ChatMessageResponseDTO
			err := json.Unmarshal([]byte(v), &redisMessageSlice)
			if err != nil {
				continue
			}
			redisMessages = append(redisMessages, redisMessageSlice)
		}
	}
	if len(redisMessages) > 0 {
		handlers.Success(ctx, "获取成功", redisMessages)
		return
	}
	// 不足 10 条就从MySQL数据库中获取

	// 如果 Redis 中没有数据，则从数据库中获取数据
	mysqlResponse, err := c.messageService.GetChatRoomMessageList(messageDTO.ChatRoomID, messageDTO.Limit, messageDTO.Offset)
	if err != nil {
		handlers.Error(ctx, err.Error())
		return
	}
	handlers.Success(ctx, "获取成功", mysqlResponse)
}

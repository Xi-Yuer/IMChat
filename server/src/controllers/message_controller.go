package controllers

import (
	"ImChat/src/dto"
	"ImChat/src/handlers"
	"ImChat/src/redis"
	"ImChat/src/services"
	"ImChat/src/utils"
	"container/list"
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
	var MessagesList []*dto.ChatMessageResponseDTO
	// 先从 Redis 中获取数据
	//redisCacheMessageListStr, err := redis.LRange(messageDTO.ChatRoomID, int64((*messageDTO.Offset-1)*(*messageDTO.Limit)), int64((*messageDTO.Offset-1)*(*messageDTO.Limit)+(*messageDTO.Limit)-1))
	startIndex := (*messageDTO.Offset - 1) * *messageDTO.Limit
	endIndex := startIndex + *messageDTO.Limit - 1
	redisCacheMessageListStr, err := redis.LRange(messageDTO.ChatRoomID, int64(startIndex), int64(endIndex))
	if err == nil {
		redisList := list.New()
		for _, v := range redisCacheMessageListStr {
			var redisMessageSlice *dto.ChatMessageResponseDTO
			err := json.Unmarshal([]byte(v), &redisMessageSlice)
			if err != nil {
				continue
			}
			redisList.PushBack(redisMessageSlice)
		}
		redisList = utils.ReverseList(redisList)
		for e := redisList.Front(); e != nil; e = e.Next() {
			MessagesList = append(MessagesList, e.Value.(*dto.ChatMessageResponseDTO))
		}
	}
	if len(MessagesList) >= *messageDTO.Limit {
		handlers.Success(ctx, "获取成功", MessagesList)
		return
	}
	// 不足 10 条就从MySQL数据库中获取
	// 如果 Redis 中没有数据，则从数据库中获取数据
	mysqlResponse, err := c.messageService.GetChatRoomMessageList(messageDTO.ChatRoomID, messageDTO.Limit, messageDTO.Offset, len(MessagesList))
	if err != nil {
		handlers.Error(ctx, err.Error())
		return
	}
	// 将消息追加到列表头部
	MessagesList = append(mysqlResponse, MessagesList...)
	//MessagesList = append(MessagesList, mysqlResponse...)
	handlers.Success(ctx, "获取成功", MessagesList)
}

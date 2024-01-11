package aiChat

import (
	aiChat "ImChat/src/AiChat/service"
	"ImChat/src/config"
	"ImChat/src/dto"
	"ImChat/src/enum"
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"time"
)

func ChatController(msg dto.MessageToRoomDTO, conn *websocket.Conn) {
	fmt.Println("ss")
	response, err := aiChat.AiChaService(msg.Message)
	if err != nil {
		return
	}
	msg.Message = response
	messageReponse := GetMessageDTO(msg, "001") // 消息
	d := &dto.MessageResponseDTO{
		Type: enum.GroupMessage,
		Data: dto.ChatMessageResponseDTO{
			User: &dto.UserResponseDTO{
				ID:             "001",
				Gender:         "0",
				Bio:            "智能机器人小鱼儿",
				Origin:         "未知",
				NickName:       "小鱼儿",
				ProfilePicture: "https://xiyuer.club/system/%E6%9C%BA%E5%99%A8%E4%BA%BA.png",
			},
			Message: messageReponse,
		},
	}
	responseJSON, _ := json.Marshal(d)
	err = conn.WriteMessage(websocket.TextMessage, []byte(responseJSON))
	if err != nil {
		return
	}
}

func GetMessageDTO(data dto.MessageToRoomDTO, userID string) *dto.MessageDTO {
	// TOODO: 在这里需要处理不用类型的消息，比如图片-语言-文字-表情-视频等....
	if data.MessageType == enum.IMAGE || data.MessageType == enum.MP3 || data.MessageType == enum.MP4 || data.MessageType == enum.XLSX || data.MessageType == enum.DOCX || data.MessageType == enum.EMOJI {
		data.Message = config.AppConfig.DoMian.URL + data.Message
	}
	return &dto.MessageDTO{
		Content:     data.Message,
		MessageType: data.MessageType,
		GroupID:     data.GroupID,
		FileName:    data.FileName,
		CreatedAt:   time.Now(),
	}
}

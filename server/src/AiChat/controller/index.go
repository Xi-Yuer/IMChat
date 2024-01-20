package aiChat

import (
	aiChat "ImChat/src/AiChat/service"
	"ImChat/src/config"
	"ImChat/src/db"
	"ImChat/src/dto"
	"ImChat/src/enum"
	"ImChat/src/repositories"
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

func ChatController(msg dto.MessageToRoomDTO, conn *websocket.Conn) (*dto.MessageResponseDTO, error) {
	response, err := aiChat.AiChaService(msg.Message)
	if err != nil {
		return nil, err
	}
	userResponse := getUserResponse(config.AppConfig.SparkAi.RobotID)
	msg.Message = response // 消息
	messageReponse := GetMessageDTO(msg)
	d := &dto.MessageResponseDTO{
		Type: enum.GroupMessage, // 响应体
		Data: dto.ChatMessageResponseDTO{
			User:    userResponse,
			Message: messageReponse,
		},
	}

	responseJSON, _ := json.Marshal(d)
	err = conn.WriteMessage(websocket.TextMessage, []byte(responseJSON))
	if err != nil {
		return nil, err
	}
	return d, nil
}

func GetMessageDTO(data dto.MessageToRoomDTO) *dto.MessageDTO {
	// TOODO: 在这里需要处理不用类型的消息，比如图片-语言-文字-表情-视频等....
	if data.MessageType == enum.IMAGE || data.MessageType == enum.MP3 || data.MessageType == enum.VOICE || data.MessageType == enum.MP4 || data.MessageType == enum.XLSX || data.MessageType == enum.DOCX || data.MessageType == enum.EMOJI {
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
func getUserResponse(userID string) *dto.UserResponseDTO {
	user, err := repositories.NewUserRepository(db.DB).GetUserDetailByUserID(userID)
	if err != nil {
		log.Println(err)
		return nil
	}

	baseUrl := config.AppConfig.DoMian.URL
	return &dto.UserResponseDTO{
		ID:             user.ID,
		NickName:       user.NickName,
		Gender:         user.Gender,
		Bio:            user.Bio,
		ProfilePicture: baseUrl + user.ProfilePicture,
		LastLogin:      user.LastLogin,
		Origin:         user.Origin,
	}
}

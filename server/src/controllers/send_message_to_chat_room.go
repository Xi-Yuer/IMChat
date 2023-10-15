package controllers

import (
	"ImChat/src/db"
	"ImChat/src/dto"
	"ImChat/src/enum"
	"ImChat/src/models"
	"ImChat/src/repositories"
	"encoding/json"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

var messageStorageChannel = make(chan *models.Message, 100) // 创建一个消息存储通道

// 处理消息
func HandleReceivedData(data dto.MessageToRoomDTO, UserID string) {
	// 在这里进行相应的逻辑处理，例如将消息存储到数据库或广播给其他用户
	// 广播接收到的消息给所有在线客户端
	// 构建要发送的响应数据
	userResponse := getUserResponse(UserID)       // 发送者
	messageReponse := getMessageDTO(data, UserID) // 消息
	response := &dto.MessageResponseDTO{
		Type: enum.GroupMessage, // 响应体
		Data: dto.ChatMessageResponseDTO{
			User:    userResponse,
			Message: messageReponse,
		},
	}
	messageDTO := getMessageResponse(data, UserID) // 写入消息
	// 将消息发送到消息管道中
	messageStorageChannel <- messageDTO

	// 开启一个单独的线程存储消息到数据库中
	go messageStorageWorker(messageDTO)

	// 广播消息
	responseJSON, _ := json.Marshal(response)
	for conn, user := range models.Connection {
		if GroupInUser(user, data.GroupID) {
			// 发送响应数据给用户所在群组的所有用户
			conn.WriteMessage(websocket.TextMessage, []byte(responseJSON))
		}
	}
}

// 通知群在线用户获取最新群在线人数信息
func SendGroupChatNumber(conn *websocket.Conn) {
	response := &dto.MessageResponseDTO{
		Type: enum.GroupMemberUpdate, // 响应体
	}
	responseJSON, _ := json.Marshal(response)
	conn.WriteMessage(websocket.TextMessage, []byte(responseJSON))
}

// 是否将消息广播给该连接用户
func GroupInUser(user models.UserConnection, group string) bool {
	found := false
	for _, _group := range user.Groups {
		if _group == group {
			found = true
			break // 如果找到了，可以提前退出循环
		}
	}
	return found
}

func getUserResponse(userID string) *dto.UserResponseDTO {
	user, err := repositories.NewUserRepository(db.DB).GetUserDetailByUserID(userID)
	if err != nil {
		log.Println(err)
		return nil
	}

	return &dto.UserResponseDTO{
		ID:             user.ID,
		Account:        user.Account,
		Gender:         user.Gender,
		Bio:            user.Bio,
		ProfilePicture: user.ProfilePicture,
		LastLogin:      user.LastLogin,
	}
}

func getMessageResponse(data dto.MessageToRoomDTO, UserID string) *models.Message {
	return &models.Message{
		Content:     data.Message,
		MessageType: data.MessageType,
		SenderID:    UserID,
		ChatRoomID:  data.GroupID,
	}
}

func getMessageDTO(data dto.MessageToRoomDTO, userID string) *dto.MessageDTO {
	return &dto.MessageDTO{
		Content:     data.Message,
		MessageType: data.MessageType,
		CreatedAt:   time.Now().Format("2006-01-02 15:04:05"),
	}
}

// 将消息存储到数据库
func storageMessage(message *models.Message) {
	db.DB.Create(message)
}

// 启动单独的 goroutine 处理消息存储
func messageStorageWorker(messageDTO *models.Message) {
	for message := range messageStorageChannel {
		storageMessage(message)
	}
}

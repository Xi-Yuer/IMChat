package controllers

import (
	"ImChat/src/config"
	"ImChat/src/db"
	"ImChat/src/dto"
	"ImChat/src/enum"
	"ImChat/src/models"
	"ImChat/src/repositories"
	"ImChat/src/utils"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var messageStorageChannel = make(chan *models.Message, 100) // 创建一个消息存储通道

// 处理消息
func HandleReceivedData(p []byte, UserID string) {
	// 在这里进行相应的逻辑处理，例如将消息存储到数据库或广播给其他用户
	// 广播接收到的消息给所有在线客户端
	// 构建要发送的响应数据
	var data dto.MessageToRoomDTO
	if err := json.Unmarshal(p, &data); err != nil {
		log.Println(err)
		return
	}
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
	go messageStorageWorker()

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
func SendGroupChatNumber(outConn *websocket.Conn, c *gin.Context, id string) {
	fmt.Println("id===========", id)
	response := &dto.BaseMessageResponseDTO{
		Type: enum.UserOffline, // 响应体
	}
	responseJSON, _ := json.Marshal(response)
	userRepo := repositories.NewUserRepository(db.DB)
	time := time.Now()
	userRepo.Logout(id, time)
	for _, v := range models.Connection {
		// 发送响应数据给用户所在群组的所有用户
		// TODO:这里其实应该只通知下线用户所在群的所有用户连接，但是我获取到的下载用户的群组ID为空，所以只能暂时通知所有在线用户
		v.Conn.WriteMessage(websocket.TextMessage, []byte(responseJSON))
	}
}

// 用户上线
func UserOnline(conn models.UserConnection) {
	// 通知群在线用户获取最新群在线人数信息
	response := &dto.BaseMessageResponseDTO{
		Type: enum.UserOnline, // 响应体
	}
	responseJSON, _ := json.Marshal(response)
	for _, v := range models.Connection {
		if utils.FirstArrayInLastArray(v.Groups, conn.Groups) {
			// 发送响应数据给用户所在群组的所有用户
			v.Conn.WriteMessage(websocket.TextMessage, []byte(responseJSON))
		}
	}
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

func getMessageResponse(data dto.MessageToRoomDTO, UserID string) *models.Message {
	return &models.Message{
		Content:     data.Message,
		MessageType: data.MessageType,
		SenderID:    UserID,
		ChatRoomID:  data.GroupID,
	}
}

func getMessageDTO(data dto.MessageToRoomDTO, userID string) *dto.MessageDTO {
	// TOODO: 在这里需要处理不用类型的消息，比如图片-语言-文字-表情-视频等....
	return &dto.MessageDTO{
		Content:     data.Message,
		MessageType: data.MessageType,
		GroupID:     data.GroupID,
		CreatedAt:   time.Now().Format("2006-01-02 15:04:05"),
	}
}

// 启动单独的 goroutine 处理消息存储
func messageStorageWorker() {
	for message := range messageStorageChannel {
		storageMessage(message)
	}
}

// 将消息存储到数据库
func storageMessage(message *models.Message) {
	db.DB.Create(message)
	// 更新群聊信息
	db.DB.Model(&models.ChatRoom{}).Where("id = ?", message.ChatRoomID).Update("current_msg", message.Content).Update("current_msg_time", message.CreatedAt)
}

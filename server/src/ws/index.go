package ws

import (
	"ImChat/src/db"
	"ImChat/src/dto"
	"ImChat/src/models"
	"ImChat/src/repositories"
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// 用户信息
type User struct {
	UserID string
	Groups []string
	Conn   *websocket.Conn
}

var users = make(map[*websocket.Conn]User)                  // 用于跟踪连接的用户
var userMutex sync.Mutex                                    // 互斥锁
var messageStorageChannel = make(chan *models.Message, 100) // 创建一个消息存储通道

// 用户连接
func HandleWebSocketConnections(c *gin.Context) {
	// 将 HTTP 连接升级为 WebSocket 连接
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer ws.Close()

	// 将连接添加到客户端列表
	// 添加用户到连接映射
	// 从 WebSocket 请求头中获取用户信息
	UserID, _ := c.Get("id")
	chatRoomRepository := repositories.NewUserRoomChatRepository(db.DB)
	userChatRoom, err := chatRoomRepository.FindUserChatRoom(UserID.(string))
	if err != nil {
		log.Println(err)
		return
	}
	userGroups := make([]string, 10)
	for _, v := range userChatRoom {
		userGroups = append(userGroups, v.ChatRoomID)
	}
	userMutex.Lock()
	users[ws] = User{
		UserID: UserID.(string), // 用户名
		Groups: userGroups,      // 群组
		Conn:   ws,
	}
	userMutex.Unlock()

	for {
		// 从 WebSocket 连接中读取消息
		messageType, p, err := ws.ReadMessage()
		if err != nil {
			log.Println(err)
			delete(users, ws)
			return
		}

		// 在这里处理接收到的 JSON 数据
		if messageType == websocket.TextMessage {
			var data dto.MessageTypeData
			if err := json.Unmarshal(p, &data); err != nil {
				log.Println(err)
			} else {
				// 处理接收到的数据
				handleReceivedData(data, UserID.(string))
			}
		}

	}
}

// 处理消息
func handleReceivedData(data dto.MessageTypeData, UserID string) {
	// 在这里进行相应的逻辑处理，例如将消息存储到数据库或广播给其他用户
	// 广播接收到的消息给所有在线客户端
	// 构建要发送的响应数据
	userResponse := getUserResponse(UserID)       // 发送者
	messageReponse := getMessageDTO(data, UserID) // 消息
	response := &dto.MessageResponseDTO{          // 响应体
		User:    userResponse,
		Message: messageReponse,
	}
	messageDTO := getMessageResponse(data, UserID) // 写入消息
	// 将消息发送到消息管道中
	messageStorageChannel <- messageDTO

	// 开启一个单独的线程存储消息到数据库中
	go messageStorageWorker(messageDTO)

	// 广播消息
	responseJSON, _ := json.Marshal(response)
	for conn, user := range users {
		if GroupInUser(user, data.GroupID) {
			// 发送响应数据给用户所在群组的所有用户
			conn.WriteMessage(websocket.TextMessage, []byte(responseJSON))
		}
	}
}

// 是否将消息广播给该连接用户
func GroupInUser(user User, group string) bool {
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

func getMessageResponse(data dto.MessageTypeData, UserID string) *models.Message {
	return &models.Message{
		Content:     data.Message,
		MessageType: data.MessageType,
		SenderID:    UserID,
		ChatRoomID:  data.GroupID,
	}
}

func getMessageDTO(data dto.MessageTypeData, userID string) *dto.MessageDTO {
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

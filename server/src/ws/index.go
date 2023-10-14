package ws

import (
	"ImChat/src/db"
	"ImChat/src/dto"
	"ImChat/src/models"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// var Clients = make(map[*websocket.Conn]bool)
// 用户信息
type User struct {
	UserID string
	Groups []string
	Conn   *websocket.Conn
}

var users = make(map[*websocket.Conn]User) // 用于跟踪连接的用户
var userMutex sync.Mutex
var messageStorageChannel = make(chan *models.Message, 10) // 创建一个消息存储通道

// 用户连接
func HandleWebSocketConnections(w http.ResponseWriter, r *http.Request) {
	// 将 HTTP 连接升级为 WebSocket 连接
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer ws.Close()

	// 将连接添加到客户端列表
	// 添加用户到连接映射
	// 从 WebSocket 请求头中获取用户信息
	Username := r.Header.Get("X-Username")
	Groups := r.Header.Get("X-Groups")
	GroupsArr := strings.Split(Groups, ",")
	userMutex.Lock()
	users[ws] = User{
		UserID: Username,  // 示例用户名
		Groups: GroupsArr, // 示例群组
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
			var data struct {
				Message     string `json:"message"`
				UserID      string `json:"user_id"`
				MessageType string `json:"message_type"`
				GroupID     string `json:"group"`
			}
			if err := json.Unmarshal(p, &data); err != nil {
				log.Println(err)
			} else {
				// 处理接收到的数据
				handleReceivedData(data)
			}
		}

	}
}

// 处理消息
func handleReceivedData(data struct {
	Message     string `json:"message"`
	UserID      string `json:"user_id"`
	MessageType string `json:"message_type"`
	GroupID     string `json:"group"`
}) {
	// 在这里进行相应的逻辑处理，例如将消息存储到数据库或广播给其他用户
	// 你也可以向客户端发送响应数据，如果需要的话
	// 广播接收到的消息给所有在线客户端
	// 构建要发送的响应数据
	response := &dto.CreateMessageDTO{
		Content:     data.Message,
		MessageType: data.MessageType,
		ReceiverID:  data.GroupID,
		UserID:      data.UserID,
	}
	messageDTO := &models.Message{
		Content:     data.Message,
		MessageType: data.MessageType,
		SenderID:    data.UserID,
		ChatRoomID:  data.GroupID,
	}
	messageStorageChannel <- messageDTO
	// 启动单独的 goroutine 处理消息存储
	go func(messageDTO *models.Message) {
		for message := range messageStorageChannel {
			storageMessage(message)
		}
	}(messageDTO)

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

// 将消息存储到数据库
func storageMessage(message *models.Message) {
	db.DB.Create(message)
}

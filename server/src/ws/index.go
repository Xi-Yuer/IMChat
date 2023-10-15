package ws

import (
	"ImChat/src/controllers"
	"ImChat/src/db"
	"ImChat/src/dto"
	"ImChat/src/enum"
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

var connectionMutex sync.Mutex
var userMutex sync.Mutex // 互斥锁

// 创建WebSocket连接
func UpgradeWebSocketConnection(c *gin.Context) (*websocket.Conn, error) {
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return ws, nil
}

// 处理用户信息和添加到连接映射
func HandleUserInfoAndAddToConnection(ws *websocket.Conn, c *gin.Context) error {
	// 从 WebSocket 请求头中获取用户信息
	UserID, _ := c.Get("id")
	chatRoomRepository := repositories.NewUserRoomChatRepository(db.DB)
	userChatRoom, err := chatRoomRepository.FindUserChatRoom(UserID.(string))
	if err != nil {
		log.Println(err)
		return err
	}
	userGroups := make([]string, 10)
	for _, v := range userChatRoom {
		userGroups = append(userGroups, v.ChatRoomID)
	}

	userMutex.Lock()
	models.Connection[ws] = models.UserConnection{
		UserID: UserID.(string), // 用户名
		Groups: userGroups,      // 群组
		Conn:   ws,
	}
	userMutex.Unlock()

	return nil
}

// 处理接收到的消息
func HandleReceivedMessage(p []byte, c *gin.Context) {
	// 在这里处理接收到的 JSON 数据
	id, _ := c.Get("id") // 用户携带 token 之后就会有 id 信息

	// 获取传递过来的数据 type 值
	var MessageType struct {
		Type string `json:"type"`
	}
	if err := json.Unmarshal(p, &MessageType); err != nil {
		log.Println(err)
		return
	}

	switch MessageType.Type {
	case enum.GroupMessage:
		var data dto.MessageToRoomDTO
		if err := json.Unmarshal(p, &data); err != nil {
			log.Println(err)
		} else {
			// 处理接收到的数据
			controllers.HandleReceivedData(data, id.(string))
		}
	default:
		// 处理其他消息类型
	}
}

// 函数用于检查连接并关闭已断开的连接
func CheckAndCloseDisconnectedConnections() {
	for conn, user := range models.Connection {
		// 检查连接状态
		if err := conn.WriteControl(websocket.PingMessage, nil, time.Now().Add(5*time.Second)); err != nil {
			// 发送Ping消息失败，表示连接已断开
			// 关闭连接
			conn.Close()
			// 从映射中移除用户
			delete(models.Connection, conn)
			// 通知其他用户该用户已下线
			connectionMutex.Lock()
			defer connectionMutex.Unlock()
			// for conn, user := range models.Connection {
			// 	go controllers.SendGroupChatNumber(conn)
			// 	for _, group := range user.Groups {
			// 		// 通知其他用户该用户已下线
			// 		for _, usergroup := range user.Groups {
			// 			if usergroup == group {
			// 				// 该用户需要重新请求群聊天人数
			// 			}
			// 		}
			// 	}
			// }
			log.Printf("Connection with UserID %s closed due to disconnect.\n", user.UserID)
		}
	}
}

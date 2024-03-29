package ws

import (
	"ImChat/src/controllers"
	"ImChat/src/db"
	"ImChat/src/enum"
	"ImChat/src/models"
	"ImChat/src/repositories"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var userMutex sync.Mutex // 互斥锁

// UpgradeWebSocketConnection 创建WebSocket连接
func UpgradeWebSocketConnection(c *gin.Context) (*websocket.Conn, error) {
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return ws, nil
}

// HandleUserInfoAndAddToConnection 处理用户信息和添加到连接映射
func HandleUserInfoAndAddToConnection(ws *websocket.Conn, c *gin.Context) error {
	// 从 WebSocket 请求头中获取用户信息
	UserID := c.Query("id")
	chatRoomRepository := repositories.NewUserRoomChatRepository(db.DB)
	userChatRoom, err := chatRoomRepository.FindUserChatRoom(UserID)
	if err != nil {
		log.Println(err)
		return err
	}
	userGroups := make([]string, 10)
	for _, v := range userChatRoom {
		userGroups = append(userGroups, v.ChatRoomID)
	}

	userMutex.Lock()
	conn := models.UserConnection{
		UserID: UserID,     // 用户名
		Groups: userGroups, // 群组
		Conn:   ws,
	}
	models.Connection[ws] = conn
	go controllers.UserOnline(conn, c)
	userMutex.Unlock()

	return nil
}

// HandleReceivedMessage 处理接收到的消息
func HandleReceivedMessage(p []byte, c *gin.Context) {
	// 在这里处理接收到的 JSON 数据
	id := c.Query("id") // 用户携带 token 之后就会有 id 信息
	if id == "" {
		log.Println("用户ID为空")
		return
	}
	// 获取传递过来的数据 type 值
	var MessageType struct {
		Type string `json:"type"`
	}
	if err := json.Unmarshal(p, &MessageType); err != nil {
		log.Println(err)
		return
	}

	switch MessageType.Type {
	// 群消息
	case enum.GroupMessage:
		controllers.HandleReceivedData(p, id)
	default:
		// 处理其他消息类型
	}
}

// CheckHeartbeat 检测客户端连接状态
func CheckHeartbeat(conn *websocket.Conn, c *gin.Context, id string) {
loop:
	for {
		time.Sleep(time.Second * 20) // 每20秒发送一次Ping消息
		err := conn.WriteControl(websocket.PingMessage, []byte("ping"), time.Time{})
		if err != nil {
			log.Println("客户端离线")
			// 处理客户端离线业务
			controllers.SendGroupChatNumber(conn, c, id)
			// 删除连接维护
			RemoveConnection(conn)
			// 停止循环，不再发送 ping
			break loop
		}
	}
}

// RemoveConnection 删除连接
func RemoveConnection(conn *websocket.Conn) {
	// 关闭WebSocket连接
	err := conn.Close()
	if err != nil {
		return
	}
	// 从连接池中移除连接
	userMutex.Lock()
	delete(models.Connection, conn)
	userMutex.Unlock()
}

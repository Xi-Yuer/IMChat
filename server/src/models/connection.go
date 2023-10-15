package models

import "github.com/gorilla/websocket"

type UserConnection struct {
	UserID string
	Groups []string
	Conn   *websocket.Conn
}

var Connection = make(map[*websocket.Conn]UserConnection) // 用于跟踪连接的用户

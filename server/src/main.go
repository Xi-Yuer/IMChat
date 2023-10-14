package main

import (
	_ "ImChat/src/config"
	"ImChat/src/routes"
	"ImChat/src/ws"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	routes.SetupRoutes(r)
	go websocket()
	r.Run(":8080")
}

func websocket() {
	http.HandleFunc("/ws", ws.HandleWebSocketConnections)
	http.ListenAndServe(":8081", nil)
}

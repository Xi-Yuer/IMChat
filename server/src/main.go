package main

import (
	_ "ImChat/src/config"
	"ImChat/src/middlewares"
	_ "ImChat/src/redis"
	"ImChat/src/routes"
	"github.com/didip/tollbooth"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(middlewares.Cors())
	// 限制每秒请求次数为 10
	limiter := tollbooth.NewLimiter(10, nil)
	r.Use(middlewares.Limiter(limiter))
	routes.SetupRoutes(r)
	err := r.Run(":8080")
	if err != nil {
		return
	}
}

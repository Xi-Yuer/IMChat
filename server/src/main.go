package main

import (
	_ "ImChat/src/config"
	"ImChat/src/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	routes.SetupRoutes(r)
	r.Run(":8080")
}

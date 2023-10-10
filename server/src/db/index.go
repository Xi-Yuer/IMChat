package db

import (
	"ImChat/src/config"
	"fmt"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func init() {
	config := config.AppConfig
	db, err := gorm.Open(mysql.Open(config.Database.URL), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	} else {
		fmt.Println("数据库连接成功")
	}
	sqlDB, err := db.DB()
	if err != nil {
		panic("failed to get DB instanc")
	}
	// 设置最大空闲连接数
	sqlDB.SetMaxIdleConns(10)
	// 设置最大打开连接数
	sqlDB.SetMaxOpenConns(100)
	// 设置连接的最大可复用时间
	sqlDB.SetConnMaxLifetime(time.Hour)

	DB = db
}

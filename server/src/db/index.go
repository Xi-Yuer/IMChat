package db

import (
	"ImChat/src/config"
	"ImChat/src/models"
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func init() {
	// 加载配置
	config := config.AppConfig
	// 数据库连接
	db, err := gorm.Open(mysql.Open(config.Database.URL), &gorm.Config{
		// 自定义日志
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold: time.Second, // 慢 SQL 阈值
				LogLevel:      logger.Info,
				Colorful:      true,
			},
		),
	})
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

	// 数据库迁移
	err = db.AutoMigrate(&models.User{}, &models.ChatRoom{})
	if err != nil {
		panic("failed to migrate")
	}

	DB = db
}

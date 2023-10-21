package config

import (
	"ImChat/src/utils"
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

type Config struct {
	Server struct {
		Port string `mapstructure:"Port"`
	}
	Database struct {
		URL string `mapstructure:"URL"`
	}
	API struct {
		Key string `mapstructure:"Key"`
	}
	Aliyun struct {
		AccessKeyID     string `mapstructure:"AccessKeyID"`
		AccessKeySecret string `mapstructure:"AccessKeySecret"`
		Endpoint        string `mapstructure:"Endpoint"`
		BucketName      string `mapstructure:"BucketName"`
		BucketURL       string `mapstructure:"BucketURL"`
	}
	Key      string
	IPSearch struct {
		URL   string `mapstructure:"URL"`
		Query string `mapstructure:"Query"`
	}
}

var AppConfig Config
var SecretKey []byte

func init() {
	// 获取当前工作目录的绝对路径
	wd, err := os.Getwd()
	if err != nil {
		fmt.Println("获取工作目录失败:", err)
		return
	}

	// 构建配置文件的绝对路径
	configPath := filepath.Join(wd, "config", "config.yaml")
	// 初始化Viper配置
	viper.SetConfigFile(configPath) // 配置文件的路径和名称

	// 读取配置文件
	if err := viper.ReadInConfig(); err != nil {
		fmt.Println("配置文件读取失败:", err)
		return
	}

	if err := viper.Unmarshal(&AppConfig); err != nil {
		fmt.Println("配置文件解析失败:", err)
		return
	}

	secret, err := utils.GenerateRandomKey(32)
	if err != nil {
		fmt.Println("生成密钥失败:", err)
		return
	}
	SecretKey = []byte(secret)
}

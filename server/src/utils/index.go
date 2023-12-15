package utils

import (
	"crypto/rand"
	"encoding/base64"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// HashPassword 密码加密
func HashPassword(password string) (string, error) {
	// 生成密码哈希
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	// 将哈希值转换为字符串并存储在数据库中
	return string(hashedPassword), nil
}

// IsPasswordValid 密码验证
func IsPasswordValid(inputPassword, storedHashedPassword string) error {
	// 将数据库中存储的哈希密码字符串转换为字节数组
	storedHashedPasswordBytes := []byte(storedHashedPassword)

	// 使用 bcrypt 的 CompareHashAndPassword 函数来验证密码
	err := bcrypt.CompareHashAndPassword(storedHashedPasswordBytes, []byte(inputPassword))
	return err
}

// GenerateRandomKey 生成随机的密钥(全局Secret)
func GenerateRandomKey(length int) (string, error) {
	key := make([]byte, length)
	_, err := rand.Read(key)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(key), nil
}

// FirstArrayInLastArray 判断第一个数据是否存在于第二个数组中
func FirstArrayInLastArray(firstArray, lastArray []string) bool {
	//  创建一个map用于存储第一个数组的元素
	elementMap := make(map[string]bool)

	// 将第一个数组的元素添加到map中
	for _, v := range firstArray {
		elementMap[v] = true
	}

	// 遍历第二个数组的元素，检查是否存在于map中
	for _, v := range lastArray {
		if elementMap[v] {
			return true
		}
	}

	return false
}

// IsUserSelf 判断是否是用户自己
func IsUserSelf(ctx *gin.Context, operationID string) bool {
	userID, ok := ctx.Get("id")
	if !ok {
		return false
	}
	if userID == operationID {
		return true
	}
	return false
}

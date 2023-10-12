package utils

import (
	"crypto/rand"
	"encoding/base64"

	"golang.org/x/crypto/bcrypt"
)

// 密码加密
func HashPassword(password string) (string, error) {
	// 生成密码哈希
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	// 将哈希值转换为字符串并存储在数据库中
	return string(hashedPassword), nil
}

// 密码验证
func IsPasswordValid(inputPassword, storedHashedPassword string) error {
	// 将数据库中存储的哈希密码字符串转换为字节数组
	storedHashedPasswordBytes := []byte(storedHashedPassword)

	// 使用 bcrypt 的 CompareHashAndPassword 函数来验证密码
	err := bcrypt.CompareHashAndPassword(storedHashedPasswordBytes, []byte(inputPassword))
	return err
}

// 生成随机的密钥(全局Secret)
func GenerateRandomKey(length int) (string, error) {
	key := make([]byte, length)
	_, err := rand.Read(key)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(key), nil
}

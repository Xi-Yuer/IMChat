package redis

import (
	"ImChat/src/config"
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
)

var RDB *redis.Client

func init() {
	InitRedis()
}
func InitRedis() {
	RDB = redis.NewClient(&redis.Options{
		Addr:     config.AppConfig.Redis.URL, // Redis地址
		Password: "",                         // Redis密码，没有则留空
		DB:       0,                          // 默认数据库
	})
	Ping()
}

func CloseRedis() {
	err := RDB.Close()
	if err != nil {
		panic(err)
	}
}

func Ping() {
	_, err := RDB.Ping(context.Background()).Result()
	fmt.Println("redis连接成功")
	if err != nil {
		panic(err)
	}
}

func Set(key string, value string) error {
	err := RDB.Set(context.Background(), key, value, 0).Err()
	if err != nil {
		return err
	}
	return nil
}

func Get(key string) (string, error) {
	val, err := RDB.Get(context.Background(), key).Result()
	if err == redis.Nil {
		return "", nil
	} else if err != nil {
		return "", err
	}
	return val, nil
}

func Del(key string) error {
	err := RDB.Del(context.Background(), key).Err()
	if err != nil {
		return err
	}
	return nil
}

func Exists(key string) (bool, error) {
	val, err := RDB.Exists(context.Background(), key).Result()
	if err != nil {
		return false, err
	}
	return val == 1, nil
}

func LPush(key string, value string) (bool, error) {
	val, err := RDB.LPush(context.Background(), key, value).Result()
	// 限制 300 条数据
	//err = RDB.LTrim(context.Background(), key, 0, 299).Err()
	if err != nil {
		return false, err
	}
	return val == 1, nil
}

func RPop(key string) (string, error) {
	val, err := RDB.RPop(context.Background(), key).Result()
	if err != nil {
		return "", err
	}
	return val, nil
}

func LRange(key string, start int64, end int64) ([]string, error) {
	// 获取列表中的元素
	val, err := RDB.LRange(context.Background(), key, start, end).Result()
	if err != nil {
		return nil, err
	}
	return val, nil
}

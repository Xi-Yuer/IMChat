package aiChat

import (
	"ImChat/src/config"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

var (
	hostUrl   = config.AppConfig.SparkAi.HostURL
	appid     = config.AppConfig.SparkAi.APPID
	apiSecret = config.AppConfig.SparkAi.APIScret
	apiKey    = config.AppConfig.SparkAi.ApiKey
)

func AiChaService(question string) (string, error) {
	d := websocket.Dialer{
		HandshakeTimeout: 5 * time.Second,
	}
	// 握手并建立 WebSocket 连接
	conn, resp, err := d.Dial(assembleAuthUrl1(hostUrl, apiKey, apiSecret), nil)
	if err != nil {
		return "", fmt.Errorf("WebSocket dialing error: %s\n%s", err.Error(), readResp(resp))
	} else if resp.StatusCode != 101 {
		return "", fmt.Errorf("WebSocket handshake failed: %s\n%s", err.Error(), readResp(resp))
	}

	defer func(conn *websocket.Conn) {
		err := conn.Close()
		if err != nil {

		}
	}(conn)

	data := genParams(appid, question)
	err = conn.WriteJSON(data)
	if err != nil {
		return "", fmt.Errorf("WebSocket write error: %s", err.Error())
	}

	var answer strings.Builder
	// 获取返回的数据
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			return "", fmt.Errorf("WebSocket read error: %s", err.Error())
		}

		var data map[string]interface{}
		err = json.Unmarshal(msg, &data)
		if err != nil {
			return "", fmt.Errorf("JSON parsing error: %s", err.Error())
		}

		header := data["header"].(map[string]interface{})
		code := header["code"].(float64)

		if code != 0 {
			payload := data["payload"].(map[string]interface{})
			fmt.Printf("Error: %v\n", payload)
			return "", fmt.Errorf("chatbot response error")
		}

		payload := data["payload"].(map[string]interface{})
		choices := payload["choices"].(map[string]interface{})
		status := choices["status"].(float64)
		text := choices["text"].([]interface{})
		content := text[0].(map[string]interface{})["content"].(string)

		answer.WriteString(content)

		if status == 2 {
			usage := payload["usage"].(map[string]interface{})
			totalTokens := usage["text"].(map[string]interface{})["total_tokens"].(float64)
			fmt.Println("total_tokens:", totalTokens)
			break
		}
	}

	return answer.String(), nil
}

// 生成参数
func genParams(appid, question string) map[string]interface{} { // 根据实际情况修改返回的数据结构和字段名

	messages := []Message{
		{Role: "user", Content: question},
	}

	data := map[string]interface{}{ // 根据实际情况修改返回的数据结构和字段名
		"header": map[string]interface{}{ // 根据实际情况修改返回的数据结构和字段名
			"app_id": appid, // 根据实际情况修改返回的数据结构和字段名
		},
		"parameter": map[string]interface{}{ // 根据实际情况修改返回的数据结构和字段名
			"chat": map[string]interface{}{ // 根据实际情况修改返回的数据结构和字段名
				"domain":      "generalv3", // 根据实际情况修改返回的数据结构和字段名
				"temperature": 0.8,         // 根据实际情况修改返回的数据结构和字段名
				"top_k":       int64(6),    // 根据实际情况修改返回的数据结构和字段名
				"max_tokens":  int64(2048), // 根据实际情况修改返回的数据结构和字段名
				"auditing":    "default",   // 根据实际情况修改返回的数据结构和字段名
			},
		},
		"payload": map[string]interface{}{ // 根据实际情况修改返回的数据结构和字段名
			"message": map[string]interface{}{ // 根据实际情况修改返回的数据结构和字段名
				"text": messages, // 根据实际情况修改返回的数据结构和字段名
			},
		},
	}
	return data // 根据实际情况修改返回的数据结构和字段名
}

// 创建鉴权url  apikey 即 hmac username
func assembleAuthUrl1(hosturl string, apiKey, apiSecret string) string {
	ul, err := url.Parse(hosturl)
	if err != nil {
		fmt.Println(err)
	}
	//签名时间
	date := time.Now().UTC().Format(time.RFC1123)
	//date = "Tue, 28 May 2019 09:10:42 MST"
	//参与签名的字段 host ,date, request-line
	signString := []string{"host: " + ul.Host, "date: " + date, "GET " + ul.Path + " HTTP/1.1"}
	//拼接签名字符串
	sgin := strings.Join(signString, "\n")
	// fmt.Println(sgin)
	//签名结果
	sha := HmacWithShaTobase64("hmac-sha256", sgin, apiSecret)
	// fmt.Println(sha)
	//构建请求参数 此时不需要urlencoding
	authUrl := fmt.Sprintf("hmac username=\"%s\", algorithm=\"%s\", headers=\"%s\", signature=\"%s\"", apiKey,
		"hmac-sha256", "host date request-line", sha)
	//将请求参数使用base64编码
	authorization := base64.StdEncoding.EncodeToString([]byte(authUrl))

	v := url.Values{}
	v.Add("host", ul.Host)
	v.Add("date", date)
	v.Add("authorization", authorization)
	//将编码后的字符串url encode后添加到url后面
	callurl := hosturl + "?" + v.Encode()
	return callurl
}

func HmacWithShaTobase64(algorithm, data, key string) string {
	mac := hmac.New(sha256.New, []byte(key))
	mac.Write([]byte(data))
	encodeData := mac.Sum(nil)
	return base64.StdEncoding.EncodeToString(encodeData)
}

func readResp(resp *http.Response) string {
	if resp == nil {
		return ""
	}
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
	return fmt.Sprintf("code=%d,body=%s", resp.StatusCode, string(b))
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

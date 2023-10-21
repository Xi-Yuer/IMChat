package https

import (
	"ImChat/src/config"
	"ImChat/src/dto"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func GetUserOriginByIP(ip string) string {
	// 将用户的 IP 地址解析为归属地
	resp, err := http.Get(config.AppConfig.IPSearch.URL + ip + config.AppConfig.IPSearch.Query)
	var locationStr string
	if err != nil {
		fmt.Println(err.Error())
		locationStr = "未知"
	}
	defer resp.Body.Close()
	// 读取响应内容
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err.Error())
		locationStr = "未知"
	}
	var location dto.OriginData
	fmt.Println(string(body))
	if err := json.Unmarshal(body, &location); err != nil {
		fmt.Println(err.Error())
		locationStr = "未知"
	} else {
		if len(location.Data) > 0 {
			locationStr = location.Data[0].Location
		} else {
			locationStr = "未知"
		}
	}
	return locationStr
}

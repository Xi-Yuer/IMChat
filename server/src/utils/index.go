package utils

import (
	"container/list"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"github.com/disintegration/imaging"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/net/html"
	"io"
	"mime/multipart"
	"net/http"
	"regexp"
	"strings"
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

type MediaRect struct {
	Width  int
	Height int
}

// HandelImageUplaod 处理图片上传
func HandelImageUplaod(file *multipart.FileHeader) (*MediaRect, error) {
	// 打开上传的文件
	src, err := file.Open()
	if err != nil {
		// 错误处理逻辑
	}
	defer func(src multipart.File) {
		err := src.Close()
		if err != nil {
			panic("file close error")
		}
	}(src)

	// 使用imaging库解码图像文件
	img, err := imaging.Decode(src)
	if err != nil {
		// 错误处理逻辑
		panic(err)
	}

	// 获取图像的宽度和高度
	width := img.Bounds().Dx()
	height := img.Bounds().Dy()

	return &MediaRect{
		Width:  width,
		Height: height,
	}, nil
}

// IsAtRobatMessage 是否是 @ 消息
func IsAtRobatMessage(msg string) bool {
	// 匹配以@机器人小鱼开头的消息，后面可以有任意字符
	pattern := `@机器人小鱼\s*(.+)`
	re := regexp.MustCompile(pattern)
	matches := re.FindAllStringSubmatch(msg, -1)
	// 检查是否有匹配项
	return len(matches) > 0
}

// StringsReplacer 格式化字符创
func stringsReplacer() *strings.Replacer {
	replacements := []string{
		"<", "&lt;",
		">", "&gt;",
		"'", "&#39;",
		`"`, "&quot;",
	}
	return strings.NewReplacer(replacements...)
}
func EscapeHTML(str string) string {
	replacer := stringsReplacer()
	return replacer.Replace(str)
}

// GetHTMLTitle 解析URL网站标题
func GetHTMLTitle(url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("HTTP request failed with status: %s", resp.Status)
	}

	doc, err := html.Parse(resp.Body)
	if err != nil {
		return "", err
	}

	title, found := findHTMLTitle(doc)
	if !found {
		return "", err
	}

	return title, nil
}

func findHTMLTitle(n *html.Node) (string, bool) {
	if n.Type == html.ElementNode && n.Data == "title" {
		if n.FirstChild != nil {
			return n.FirstChild.Data, true
		}
		return "", false
	}

	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if title, found := findHTMLTitle(c); found {
			return title, true
		}
	}

	return "", false
}

// ParseUrls 解析 URL
func ParseUrls(text string) []string {
	// ((http|https)://)?(www\.)?([\w_-]+(?:\.[\w_-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?
	urlRegex := regexp.MustCompile(`((http|https)://)(www\.)?([\w_-]+(?:\.[\w_-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?`)
	matches := urlRegex.FindAllString(text, -1)
	return matches
}

// ReverseList 翻转列表
func ReverseList(l *list.List) *list.List {
	reversedList := list.New()
	for e := l.Back(); e != nil; e = e.Prev() {
		reversedList.PushBack(e.Value)
	}
	return reversedList
}

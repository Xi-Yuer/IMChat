# 搭建一个在线群聊

## 技术选型

- 后端
  - Go + Gin + GORM + Mysql + Soket + OSS
- 前端
  - React + Ant Design + AHooks + RTK

## 目标功能

- [x] 支持群聊
- [x] 创建群聊
- [x] 提及功能
- [x] ai 智能助手
- [x] 文本 URL 解析
- [x] 支持图片、文件、视频、语音、表情
- [x] 支持消息历史回滚
- [ ] 支持私聊

## 项目运行

### 后端

因为后端涉及到 `token` `密钥` 等相关环境变量配置项，git 托管未将改代码上传，需根据配置 `yaml` 自行配置

```yaml
// ~server/src/config/config.yaml
Server:
  Port: '8080'
Database:
  URL: 'root:[MySQL密码]@tcp([MySQL服务器地址])/im_chat?charset=utf8mb4&parseTime=True&loc=Local'
Aliyun:
  AccessKeyId: ''
  AccessKeySecret: ''
  EndPoint: ''
  BucketName: ''
DoMian:
  URL: ''
System:
  GroupChatID: '[默认群加入的群聊ID]'
IPSearch:
  URL: 'https://tenapi.cn/v2/getip?ip='
SparkAi:
  HostURL: '星火大模型地址'
  APPID: ''
  APIScret: ''
  ApiKey: ''
  RobotID: ''
```

**配置完成即可运行**

```bash
go run main.go
```

### 前端

```bash
cd web
npm install
npm run dev
```

## 项目部署

**后端**

**打包部署**

```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main
```

**将代码上传至服务器**

```bash
 chmod 777 main #执行权限
 nohup ./main >/dev/nul # 暂不输出日志文件
```

**使用 `docker`部署**

```dockerfile
# 使用官方的Golang基础镜像
FROM golang:latest

# 设置工作目录
WORKDIR /app

# 将项目代码复制到容器中
COPY . .

# 下载依赖
RUN go mod download

# 编译Go应用
RUN go build -o main .

# 暴露应用端口
EXPOSE 8080

# 启动应用
CMD ["./main"]

```

**构建 Docker 镜像**： 打开终端，进入项目根目录，运行以下命令构建 Docker 镜像：

```bash
docker build -t your-image-name .
```

**运行 Docker 容器：** 构建完成后，可以使用以下命令在 Docker 容器中运行你的 Go Gin 应用：

```bash
docker run -p 8080:8080 your-image-name
```

**前端部署**

```nginx
# 前端静态资源
location / {
	root /imchat/web
	index index.html index.htm
}

# 以 api 开头的请求转发到 8080 端口
location /api/ {
	proxy_pass http://127.0.0.1:8080/api
}
```

## 项目结构

### 后端

```
.
├── AiChat        // AiChat 模块
│   └── ...
├── IMChatServer  // IMChatServer 模块
│   └── ...
├── common        // 通用工具
│   └── ...
├── config        // 配置文件
│   └── ...
├── controllers   // 请求处理器/控制器
│   └── ...
├── db            // 与数据库相关的代码
│   └── ...
├── dto           // 数据传输对象 (DTOs)
│   └── ...
├── enum          // 枚举
│   └── ...
├── handlers      // HTTP 处理器
│   └── ...
├── https         // HTTPS 相关的代码
│   └── ...
├── main          // 主应用逻辑
│   └── ...
├── main.go       // 主入口点
├── middlewares   // 中间件函数
│   └── ...
├── models        // 数据模型
│   └── ...
├── repositories  // 数据库仓库
│   └── ...
├── routes        // API 路由
│   └── ...
├── services      // 业务逻辑服务
│   └── ...
├── utils         // 工具函数
│   └── ...
└── ws            // WebSocket 相关的代码
    └── ...
```

### 前端

```
.
├── README.md          // 说明文档
├── index.html				 // 模板根目录
├── src								 // 源码目录
│   ├── App.tsx				 // 根组件
│   ├── assets				 // 静态资源目录
│   ├── components		 // 组件目录
│   ├── config				 // 项目配置文件
│   ├── enum					 // 枚举文件
│   ├── hooks					 // Hooks封装
│   ├── main.tsx			 // 入口文件
│   ├── routes				 // 路由表映射
│   ├── server				 // 网络请求相关
│   │   ├── apis			 // 接口
│   │   └── request		 // axios封装
│   ├── store					 // 状态管理库
│   │   ├── index.ts	 // 统一导出管理
│   │   └── modules		 // 模块划分
│   ├── style					 // 全局样式
│   ├── theme					 // 主题样式
│   │   ├── dark.ts		 // 暗黑主题
│   │   └── light.ts	 // 亮色主题
│   ├── utils					 // 工具函数封装
│   ├── views					 // 页面

```

import { useEffect, useRef, useState } from 'react'

//消息类型
export type Message = {
  type: string
  data: any
}

type WebSocketOptions = {
  url: string
  isAuthenticated: boolean
  onOpen?: () => void
  onClose?: (event: Event) => void
  onError?: (event: Event) => void
  onMessage?: (message: any) => void
  reconnectInterval?: number
  reconnectAttempts?: number
}

const defaultOptions: Required<WebSocketOptions> = {
  isAuthenticated: false,
  url: '', //连接的长链接
  onOpen: () => {}, //开启连接
  onClose: () => {}, //关闭链接
  onError: () => {}, //异常
  onMessage: () => {}, //消息
  reconnectInterval: 1000, //重连时长设置
  reconnectAttempts: 1, //最大连接范围数
}

const useWebSocket = (options: WebSocketOptions): [WebSocket | undefined, (message: any) => void, string, boolean] => {
  const { url, onOpen, onClose, onMessage, reconnectInterval, reconnectAttempts, isAuthenticated } = {
    ...defaultOptions,
    ...options,
  }

  const [isConnected, setIsConnected] = useState(false) //是否连接
  const [reconnectCount, setReconnectCount] = useState(0) //用于判断重连
  const [lastMessage, setLastMessage] = useState('') //最新的消息

  const socketRef = useRef<WebSocket>()
  const reconnectTimerRef = useRef<NodeJS.Timeout>()

  const connect = () => {
    //连接函数封装
    setIsConnected(false)

    const socket = new WebSocket(url)
    socket.onopen = () => {
      //开始连接
      console.log('WebSocket is connected')
      setIsConnected(true)
      setReconnectCount(0)
      onOpen()
    }
    socket.onclose = (event) => {
      //连接关闭
      console.error(`WebSocket closed with code ${event.code}`)
      setIsConnected(false)
      onClose(event)
      if (reconnectCount < reconnectAttempts) {
        //用于判断断开连接后重新连接
        reconnectTimerRef.current = setTimeout(() => {
          setReconnectCount((prevCount) => prevCount + 1)
          connect()
        }, reconnectInterval)
      }
    }
    socket.onerror = (event) => {
      //异常问题
      console.error('WebSocket error:', event)
      onClose(event)
    }
    socket.onmessage = (event) => {
      //接收到消息
      const message: any = JSON.parse(event.data)
      setLastMessage(event.data)
      onMessage(message)
    }

    socketRef.current = socket
  }

  useEffect(() => {
    if (isAuthenticated) {
      connect()
    }
    return () => {
      socketRef.current?.close()
      clearTimeout(reconnectTimerRef.current)
    }
  }, [isAuthenticated])

  const sendMessage = (message: any) => {
    //用于发送消息
    if (isConnected && socketRef.current) {
      console.log(`WebSocket sending message: ${JSON.stringify(message)}`)
      socketRef.current.send(JSON.stringify(message))
    } else {
      console.error('Cannot send message - WebSocket is not connected')
    }
  }
  //暴露出我们需要的
  return [socketRef.current, sendMessage, lastMessage, isConnected]
}

export default useWebSocket

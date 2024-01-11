import { ThemeAppearance, ThemeProvider } from 'antd-style'
import { createContext, memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { MessageType, SystemMessageType } from './enum/messageType'
import useWebSocket from './hooks/useSoket'
import { RenderRoutes } from './routes'
import { RootState } from './store'
import { changeRoomMessageList } from './store/modules/socket'
import { themeChange } from './store/modules/ui'
import { customDarkAlgorithm } from './theme/dark'
import { customLightAlgorithm } from './theme/light'

interface MessageContent {
  type: MessageType
  message: string
  message_type: SystemMessageType
  file_name?: string
  group: string
}
interface ContextType {
  sendMessage: (message: MessageContent) => void
  lastMessage: string
  webSocket: WebSocket | undefined
  isConnected: boolean
}

export const WebSocketContext = createContext<ContextType>({} as ContextType)
const Root = memo(() => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.UIReducer.theme)
  const { user } = useSelector((state: RootState) => state.UserReducer)
  const socketUrl = `${import.meta.env.VITE_APP_WS_BASEURL}?id=${user.id}`

  const [webSocket, sendMessage, lastMessage, isConnected] = useWebSocket({
    isAuthenticated: !!user.id,
    url: socketUrl, //这里放长链接
    onOpen: () => {
      //连接成功
    },
    onClose: () => {
      //连接关闭
    },
    onError: (event) => {
      //连接异常
      console.error('WebSocket error:', event)
    },
    onMessage: (message) => {
      //收到消息
      switch (message.type) {
        case MessageType.GROUP_MESSAGE:
          dispatch(changeRoomMessageList(message.data))
      }
    },
  })
  const Theme = (appearance: ThemeAppearance) => {
    return appearance === 'dark'
      ? { token: {}, algorithm: [customDarkAlgorithm] }
      : {
          algorithm: [customLightAlgorithm],
        }
  }
  useEffect(() => {
    dispatch(themeChange(theme))
  }, [])
  return (
    <>
      <HashRouter>
        <ThemeProvider themeMode={theme} theme={Theme}>
          <WebSocketContext.Provider value={{ sendMessage, lastMessage, isConnected, webSocket }}>
            <RenderRoutes />
          </WebSocketContext.Provider>
        </ThemeProvider>
      </HashRouter>
    </>
  )
})

export default Root

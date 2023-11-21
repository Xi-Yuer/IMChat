import { ThemeAppearance, ThemeProvider } from 'antd-style'
import { createContext, memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { MessageType } from './enum/messageType'
import useWebSocket from './hooks/useSoket'
import { RenderRoutes } from './routes'
import { RootState } from './store'
import { changeRoomMessageList } from './store/modules/socket'
import { themeChange } from './store/modules/ui'
import { customDarkAlgorithm } from './theme/dark'
import { customLightAlgorithm } from './theme/light'

interface ContextType {
  sendMessage: (message: any) => void
  lastMessage: string
  webSocket: WebSocket | undefined
  isConnected: boolean
}

export const WebSocketContext = createContext<ContextType>({} as ContextType)
const Root = memo(() => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.UIReducer.theme)
  const { user } = useSelector((state: RootState) => state.UserReducer)
  const socketUrl = `ws://localhost:8080/ws?id=${user.id}`

  const [webSocket, sendMessage, lastMessage, isConnected] = useWebSocket({
    isAuthenticated: !!user.id,
    url: socketUrl, //这里放长链接
    onOpen: () => {
      //连接成功
      console.log('WebSocket connected')
    },
    onClose: () => {
      //连接关闭
      console.log('WebSocket disconnected')
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
          <WebSocketContext.Provider
            value={{ sendMessage, lastMessage, isConnected, webSocket }}
          >
            <RenderRoutes />
          </WebSocketContext.Provider>
        </ThemeProvider>
      </HashRouter>
    </>
  )
})

export default Root

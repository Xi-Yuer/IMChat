import { RootState } from '@/store'
import {
  LoadingOutlined,
  PictureOutlined,
  SendOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { memo, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WebSocketContext } from '../../App'
import { useScreen } from '../../hooks/useScreen'
import { getRoomMsgListRequest } from '../../server/apis/chatRoom'
import { unshiftRoomMessageList } from '../../store/modules/socket'
import MessageBubble from '../MessageBubble'
import UserPanel from '../UserPanel'

const CurrentRoom = memo(() => {
  const { sendMessage: sendMessageContext } = useContext(WebSocketContext)
  const contentRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [currentContentScrollHeight, setCurrentContentScrollHeight] =
    useState(0)
  const { isMobile } = useScreen()
  const dispatch = useDispatch()
  const { currentChatRoom, currentChatRoomUserList } = useSelector(
    (state: RootState) => state.ChatRoomReducer
  )
  const { currentRoomUserListLoading, currentRoomLoading } = useSelector(
    (state: RootState) => state.UIReducer
  )
  const { roomMessageList } = useSelector(
    (state: RootState) => state.SocketReducer
  )
  const { user } = useSelector((state: RootState) => state.UserReducer)

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (contentRef.current) {
        contentRef.current.scrollTo({
          top: contentRef.current.scrollHeight,
        })
      }
    })
  }, [])
  const sendMessage = () => {
    sendMessageContext({
      type: 'GROUP_MESSAGE',
      message: inputValue,
      message_type: 'text',
      group: currentChatRoom.id,
    })
    setInputValue('')
    return false
  }
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
      })
    }
  }, [currentChatRoom])

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
      })
    }
  }, [roomMessageList])

  const handleScroll = () => {
    if (contentRef.current) {
      if (contentRef.current.scrollTop === 0) {
        setCurrentContentScrollHeight(contentRef.current?.scrollHeight)
        setCurrentPage(currentPage + 1)
      }
    }
  }

  // 加载更多
  useEffect(() => {
    if (!user.id || !currentChatRoom.id) return
    getRoomMsgListRequest(currentChatRoom.id, 20, currentPage).then((res) => {
      if (res.data?.length) {
        dispatch(
          unshiftRoomMessageList({
            room_id: currentChatRoom.id,
            message: res.data,
          })
        )
        contentRef.current!.scrollTo({
          top: currentContentScrollHeight,
        })
      }
    })
  }, [currentPage])

  return (
    <>
      {currentChatRoom.id ? (
        <div className="p-1 flex-1 flex h-[100%]">
          <div className="flex-1 lg:border-r h-[100%] lg:border-l border-dashed dark:border-[#3b3d4b] transition-all duration-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h2 className="dark:text-gray-200 text-lg p-2">
                  {currentChatRoom.name}
                </h2>
                <div className=" ml-2 dark:text-gray-200">
                  {currentRoomLoading && <LoadingOutlined />}
                </div>
              </div>
            </div>
            <div className="flex flex-col h-full">
              {/* 消息框 */}
              <div
                className="flex-1 w-full h-full overflow-y-auto no-scrollbar p-2"
                ref={contentRef}
                onScroll={handleScroll}
              >
                {roomMessageList[currentChatRoom.id]?.map((message, index) => {
                  const lastMessageTime =
                    roomMessageList[currentChatRoom.id]?.[index - 1]?.message
                      .created_at
                  return (
                    <MessageBubble
                      {...message}
                      lastMessageTime={lastMessageTime}
                      key={message.message.content + index}
                    />
                  )
                })}
              </div>
              {/* 输入框 */}
              <div className="h-[180px] border-dashed border-t dark:border-[#494b5c] transition-all duration-700">
                <div className="w-full flex justify-between items-center px-3 pt-2">
                  <div className="flex gap-2">
                    <SmileOutlined className=" transition-all duration-700 cursor-pointer dark:text-white" />
                    <PictureOutlined className=" transition-all duration-700 cursor-pointer dark:text-white" />
                  </div>
                  <div>
                    <SendOutlined className=" transition-all duration-700 cursor-pointer dark:text-white" />
                  </div>
                </div>
                <TextArea
                  onPressEnter={sendMessage}
                  value={inputValue}
                  placeholder="愉快的聊天吧~"
                  onChange={(e) => setInputValue(e.target.value)}
                  className=" transition-all duration-700"
                  bordered={false}
                  rows={4}
                  maxLength={300}
                />
              </div>
            </div>
          </div>
          {/* 侧边栏用户列表 */}
          {!isMobile ? (
            <Spin
              spinning={currentRoomUserListLoading && !isMobile}
              wrapperClassName="hidden xl:w-[180px] xl:block"
            >
              <div className="w-0 lg:w-[180px] overflow-hidden hidden xl:block px-2 transition-all duration-700">
                {currentChatRoomUserList.map((user) => (
                  <UserPanel {...user} key={user.id} />
                ))}
                {currentChatRoomUserList.length === 0 && (
                  <div className="w-full h-full flex justify-center items-center dark:text-gray-300">
                    <div className="mt-[-150px]">
                      <SmileOutlined className="mr-2" />
                      暂无数据
                    </div>
                  </div>
                )}
              </div>
            </Spin>
          ) : null}
        </div>
      ) : null}
    </>
  )
})

export default CurrentRoom

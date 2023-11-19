import { RootState } from '@/store'
import { SmileOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { memo, useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { WebSocketContext } from '../../App'
import MessageBubble from '../MessageBubble'
import UserPanel from '../UserPanel'

const CurrentRoom = memo(() => {
  const { sendMessage: sendMessageContext } = useContext(WebSocketContext)
  const contentRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')
  const { currentChatRoom, currentChatRoomUserList } = useSelector(
    (state: RootState) => state.ChatRoomReducer
  )
  const { currentRoomUserListLoading } = useSelector(
    (state: RootState) => state.UIReducer
  )
  const { roomMessageList } = useSelector(
    (state: RootState) => state.SocketReducer
  )

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
  }, [roomMessageList])
  return (
    <>
      {currentChatRoom.id ? (
        <div className="p-1 flex-1 flex h-[100%]">
          <div className="flex-1 border-r h-[100%] border-l border-dashed dark:border-[#3b3d4b] transition-all duration-700">
            <div>
              <h2 className="dark:text-gray-200 text-lg p-2">
                {currentChatRoom.name}
              </h2>
            </div>
            <div className="flex flex-col h-full">
              <div
                className="flex-1 overflow-y-auto no-scrollbar p-2"
                ref={contentRef}
              >
                {roomMessageList[currentChatRoom.id]?.map((message, index) => {
                  return (
                    <MessageBubble
                      {...message}
                      key={message.message.content + index}
                    />
                  )
                })}
              </div>
              <div className="h-[180px] border-t dark:border-[#3b3d4b] transition-all duration-700">
                <TextArea
                  onPressEnter={sendMessage}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className=" transition-all duration-700"
                  bordered={false}
                  rows={6}
                  maxLength={100}
                />
              </div>
            </div>
          </div>
          <Spin spinning={currentRoomUserListLoading}>
            <div className="w-[180px] overflow-hidden hidden xl:block px-2">
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
        </div>
      ) : null}
    </>
  )
})

export default CurrentRoom

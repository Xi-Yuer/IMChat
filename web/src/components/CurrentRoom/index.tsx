import { RootState } from '@/store'
import {
  CustomerServiceOutlined,
  FolderOpenOutlined,
  LoadingOutlined,
  PictureOutlined,
  SendOutlined,
  SmileOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Drawer, Spin, Upload, UploadProps, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { EmojiClickData } from 'emoji-picker-react'
import { memo, useContext, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { WebSocketContext } from '../../App'
import { MessageType, SystemMessageType } from '../../enum/messageType'
import { useScreen } from '../../hooks/useScreen'
import Emoji, { EmojiRefCom } from '../Emoji'
import UserPanel from '../UserPanel'

const CurrentRoom = memo(() => {
  const { sendMessage: sendMessageContext } = useContext(WebSocketContext)
  const emojiRef = useRef<EmojiRefCom>(null)
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)
  const [messageType, setMessageType] = useState<SystemMessageType>(SystemMessageType.IMAGE)
  const [file_name, setFile_name] = useState('')

  const { isMobile } = useScreen()
  const { currentChatRoom, currentChatRoomUserList } = useSelector((state: RootState) => state.ChatRoomReducer)
  const { currentRoomUserListLoading, currentRoomLoading } = useSelector((state: RootState) => state.UIReducer)
  const { user } = useSelector((state: RootState) => state.UserReducer)

  const pickEmoji = (emoji: EmojiClickData) => {
    emojiRef.current?.hidden()
    setInputValue(emoji.emoji)
  }
  const sendTextMessage = (e?: any) => {
    e?.preventDefault()
    if (!inputValue) return
    sendMessageContext({
      type: MessageType.GROUP_MESSAGE,
      message: inputValue,
      message_type: SystemMessageType.TEXT,
      group: currentChatRoom.id,
    })
    setInputValue('')
    // 滚动到底部
    return false
  }

  const props: UploadProps = {
    name: 'file',
    action: '/api/file/upload',
    headers: {
      authorization: user.token,
    },
    showUploadList: false,
    beforeUpload(file) {
      message.loading('发送中...')
      setFile_name(file.name)
      if (/^image\/.*/.test(file.type)) {
        setMessageType(SystemMessageType.IMAGE)
      }
      if (/^(doc|docx)$/i.test(file.type)) {
        setMessageType(SystemMessageType.DOCX)
      }
      if (/^audio\/.*/.test(file!.type)) {
        setMessageType(SystemMessageType.MP3)
      }
      if (/^video\/.*/.test(file!.type)) {
        setMessageType(SystemMessageType.MP4)
      }
      if (/^application\/.*/.test(file!.type)) {
        setMessageType(SystemMessageType.XLSX)
      }
    },
    onChange(info) {
      if (info.file.status === 'done') {
        const {
          data: { file_url },
        } = info.file.response
        sendMessageContext({
          type: MessageType.GROUP_MESSAGE,
          message: file_url,
          message_type: messageType,
          group: currentChatRoom.id,
          file_name: file_name,
        })
      } else if (info.file.status === 'error') {
        message.loading('发送失败')
      }
    },
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
  }
  return (
    <>
      {currentChatRoom.id ? (
        <div className="p-1 flex-1 flex h-[100%] relative border-none focus:outline-none" style={containerStyle}>
          <div className="flex-1 lg:border-r h-[100%] lg:border-l border-dashed dark:border-[#3b3d4b] transition-all duration-700">
            <div className="flex items-center justify-between border-dashed border-b dark:border-[#494d5f] transition-all duration-700">
              <div className="flex items-center">
                <h2 className="dark:text-gray-200 text-lg p-2 transition-all duration-700">{currentChatRoom.name}</h2>
                <div className=" ml-2 dark:text-gray-200">{currentRoomLoading && <LoadingOutlined />}</div>
              </div>
              <div
                className="pr-4 dark:text-gray-200 text-lg cursor-pointer transition-all duration-700 block xl:hidden"
                onClick={() => setOpen(true)}
              >
                <TeamOutlined />
              </div>
            </div>
            <div className="flex flex-col h-full relative">
              {/* 消息框 */}
              <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar p-2">
                <div className=" flex justify-center items-center w-full absolute"></div>
              </div>
              <Emoji ref={emojiRef} pickEmoji={pickEmoji} />
              {/* 输入框 */}
              <div className="h-[180px] border-dashed border-t dark:border-[#494b5c] transition-all duration-700">
                <div className="w-full flex justify-between items-center px-3 pt-2">
                  <div className="flex gap-2">
                    <SmileOutlined className="transition-all duration-700 cursor-pointer dark:text-white" onClick={() => emojiRef.current?.show()} />
                    <Upload id="picture" {...props} accept="image/*" style={{ display: 'none' }}>
                      <PictureOutlined className="transition-all duration-700 cursor-pointer dark:text-white" />
                    </Upload>
                    <Upload id="picture" {...props} accept="audio/*" style={{ display: 'none' }}>
                      <CustomerServiceOutlined className="transition-all duration-700 cursor-pointer dark:text-white" />
                    </Upload>
                    <Upload id="file" {...props} style={{ display: 'none' }} accept=".doc,.docx,.xlsx,.pdf,.xls,audio/*,video/*">
                      <FolderOpenOutlined className="transition-all duration-700 cursor-pointer dark:text-white" />
                    </Upload>
                  </div>
                  <div onClick={() => sendTextMessage()}>
                    <SendOutlined className=" transition-all duration-700 cursor-pointer dark:text-white" />
                  </div>
                </div>
                <TextArea
                  onPressEnter={(e) => sendTextMessage(e)}
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
            <Spin spinning={currentRoomUserListLoading && !isMobile} wrapperClassName="hidden xl:w-[180px] xl:block">
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

          <Drawer
            title={false}
            placement="right"
            className="border-none focus:outline-none focus:border-none"
            width="150px"
            closable={false}
            onClose={() => setOpen(false)}
            open={open}
            getContainer={false}
          >
            <div className="overflow-hidden transition-all duration-700">
              <Spin spinning={currentRoomUserListLoading}>
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
              </Spin>
            </div>
          </Drawer>
        </div>
      ) : null}
    </>
  )
})

export default CurrentRoom

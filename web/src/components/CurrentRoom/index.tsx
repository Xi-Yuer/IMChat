import { RootState } from '@/store'
import {
  AlignLeftOutlined,
  AudioOutlined,
  CustomerServiceOutlined,
  FolderOpenOutlined,
  LoadingOutlined,
  PictureOutlined,
  SendOutlined,
  SmileOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { useLongPress } from 'ahooks'
import { Drawer, Popover, Spin, Tooltip, Upload, UploadProps, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { EmojiClickData } from 'emoji-picker-react'
import { memo, useContext, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WebSocketContext } from '../../App'
import { MessageType, SystemMessageType } from '../../enum/messageType'
import { useRecording } from '../../hooks/useRecording'
import { useScreen } from '../../hooks/useScreen'
import { getRoomMsgListRequest } from '../../server/apis/chatRoom'
import { uploadFileForm } from '../../server/apis/upload'
import { unshiftRoomMessageList } from '../../store/modules/socket'
import { changeShowProfileMenuSide } from '../../store/modules/ui'
import CalcVideo from '../../utils/calcVideo'
import Emoji, { EmojiRefCom } from '../Emoji'
import MessageBubble from '../MessageBubble'
import UserPanel from '../UserPanel'
import VoiceSpectrum from '../VoiceSpectrum'

const CurrentRoom = memo(() => {
  const { sendMessage: sendMessageContext } = useContext(WebSocketContext)
  const emojiRef = useRef<EmojiRefCom>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [isPushMessage, setIsPushMessage] = useState(true)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
  const [showBackBottomBar, setShowBackBottomBar] = useState(false)
  const [currPage, setCurrPage] = useState(2)
  const [currScrollHeight, setCurrScrollHeight] = useState(0)
  const [open, setOpen] = useState(false)
  const [atOpen, setAtOpen] = useState(false)
  const [voiceSpecOpen, setVoiceSpecOpen] = useState(false)
  const [messageType, setMessageType] = useState<SystemMessageType>(SystemMessageType.IMAGE)
  const [file_name, setFile_name] = useState('')
  const voiceSpecRef = useRef<HTMLButtonElement>(null)
  const { start, stop } = useRecording(async (file, second) => {
    if (second <= 1) {
      message.error('录音时间太短')
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('width', second + '')
    formData.append('height', '0')
    const result = await uploadFileForm(formData)
    const {
      data: { file_url },
    } = result
    setIsPushMessage(true)
    sendMessageContext({
      type: MessageType.GROUP_MESSAGE,
      message: file_url,
      message_type: SystemMessageType.VOICE,
      group: currentChatRoom.id,
      file_name: 'voice',
    })
  })

  useLongPress(() => {
    // 开始录音
    setVoiceSpecOpen(true)
    start()
  }, voiceSpecRef)

  // 结束录音
  const handleStopRecord = () => {
    setVoiceSpecOpen(false)
    stop()
  }

  const dispatch = useDispatch()
  const { isMobile } = useScreen()
  const { currentChatRoom, currentChatRoomUserList } = useSelector((state: RootState) => state.ChatRoomReducer)
  const { currentRoomUserListLoading, currentRoomLoading, showProfileMenuSide } = useSelector((state: RootState) => state.UIReducer)
  const { roomMessageList } = useSelector((state: RootState) => state.SocketReducer)
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
    setIsPushMessage(true)
    return false
  }
  useLayoutEffect(() => {
    if (isPushMessage) {
      queueMicrotask(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
        })
      })
    } else {
      queueMicrotask(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight - currScrollHeight,
        })
      })
    }
  }, [roomMessageList[currentChatRoom.id]])

  const onScroll = (e: any) => {
    setCurrScrollHeight(e.target.scrollHeight)
    setShowBackBottomBar(e.target.scrollHeight - e.target.scrollTop > 1000)
    if (e.target.scrollTop === 0) {
      setIsPushMessage(false)
      setLoadMoreLoading(true)
      getRoomMsgListRequest(currentChatRoom.id, 20, currPage)
        .then((res) => {
          setCurrPage(currPage + 1)
          dispatch(
            unshiftRoomMessageList({
              room_id: currentChatRoom.id,
              message: res.data,
            })
          )
        })
        .finally(() => {
          setLoadMoreLoading(false)
        })
    }
  }
  const backBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  const longPress = (user: string) => {
    setInputValue(inputValue + '@' + user + ' ')
    textAreaRef.current?.focus()
  }
  const atSomeOne = (name: string) => {
    setInputValue(inputValue + name + ' ')
    textAreaRef.current?.focus()
  }
  const props: UploadProps = {
    name: 'file',
    action: '/api/file/upload',
    headers: {
      authorization: user.token,
    },
    showUploadList: false,
    customRequest: async (options) => {
      const { file } = options
      let video = new CalcVideo(file as unknown as File, 2)
      video.metaValue.then(async (res) => {
        const { height, width } = res
        const formData = new FormData()
        formData.append('file', file)
        formData.append('width', width)
        formData.append('height', height)
        message.loading({
          type: 'loading',
          duration: 1000,
          content: '正在上传...',
        })
        try {
          const result = await uploadFileForm(formData)
          const {
            data: { file_url },
          } = result
          sendMessageContext({
            type: MessageType.GROUP_MESSAGE,
            message: file_url,
            message_type: messageType,
            group: currentChatRoom.id,
            file_name: file_name,
          })
          setIsPushMessage(true)
        } catch (error) {
          message.error('发送失败，请检查网络或稍后再试')
        } finally {
          message.destroy()
        }
      })
    },
    beforeUpload(file) {
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
  }
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
  }
  const userPopoverList = () => {
    return (
      <div className="w-[150px] max-h-[200px] overflow-x-hidden overflow-y-auto">
        {currentChatRoomUserList.map((item) => {
          return (
            <div
              key={item.id}
              className="my-2 flex cursor-pointer"
              onClick={() => {
                atSomeOne(item.nick_name)
                setAtOpen(false)
              }}
            >
              <img src={item.profile_picture} className="w-[20px] h-[20px] rounded-sm mr-1" alt="" />
              <span className="truncate">{item.nick_name}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const openProfile = () => {
    dispatch(changeShowProfileMenuSide(!showProfileMenuSide))
  }
  return (
    <>
      {currentChatRoom.id ? (
        <div className="p-1 flex-1 flex h-[100%] relative border-none focus:outline-none" style={containerStyle}>
          <div className="flex-1 lg:border-r h-[100%] lg:border-l border-dashed dark:border-[#3b3d4b] transition-all duration-700">
            <div className="flex items-center justify-between border-dashed border-b dark:border-[#494d5f] transition-all duration-700">
              <div className="flex items-center">
                <AlignLeftOutlined className="ml-2 dark:text-gray-200 text-lg cursor-pointer" onClick={openProfile} />
                <h2 className="dark:text-gray-200 text-lg p-2 transition-all duration-700">
                  {currentChatRoom.name}({currentChatRoomUserList.length})
                </h2>
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
              {/* 使用 betterscroll 渲染消息列表 */}
              <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar py-2 relative" style={{ height: '300px', overflow: 'hidden' }}>
                <div className="h-full w-full overflow-auto" ref={containerRef} onScroll={onScroll}>
                  <div className="w-full h-[30px] flex justify-center items-center dark:text-gray-200">{loadMoreLoading && <LoadingOutlined />}</div>
                  {roomMessageList[currentChatRoom.id]?.map((list, index) => {
                    return (
                      <div key={index} className="p-2">
                        <MessageBubble
                          key={index}
                          longPress={longPress}
                          message={list.message}
                          user={list.user}
                          lastMessageTime={roomMessageList[currentChatRoom.id][index - 1]?.message.created_at}
                        />
                      </div>
                    )
                  })}
                  {showBackBottomBar && (
                    <div
                      className="absolute cursor-pointer hover:shadow-md text-gray-700 transition-colors duration-700 right-0 w-[90px] rounded-l-2xl dark:bg-opacity-80 h-[30px] bg-gray-200 bottom-[200px] text-center leading-[30px] dark:bg-[#64686f] dark:text-gray-200"
                      onClick={backBottom}
                    >
                      回到底部
                    </div>
                  )}
                </div>
                {/* 音频指示区域 */}
                {voiceSpecOpen && (
                  <div className=" flex items-center justify-center absolute left-1/2 transition-all duration-700 top-1/2 translate-x-[-50%] rounded-sm bg-[#f2f5f9] bg-opacity-80 dark:bg-opacity-80 dark:bg-[#494b5a] shadow-sm w-[200px] h-[80px]">
                    <VoiceSpectrum />
                  </div>
                )}
              </div>
              <Emoji ref={emojiRef} pickEmoji={pickEmoji} />
              {/* 输入框 */}
              <div className="h-[180px] border-dashed border-t dark:border-[#494b5c] transition-all duration-700">
                <div className="w-full flex justify-between items-center px-3 pt-2">
                  <div className="flex gap-2">
                    <Popover title="" open={atOpen} content={userPopoverList()} placement="bottomLeft">
                      <SmileOutlined
                        className="transition-all duration-700 cursor-pointer dark:text-white"
                        onClick={() => emojiRef.current?.show()}
                      />
                    </Popover>
                    <Upload id="picture" {...props} accept="image/*" style={{ display: 'none' }}>
                      <PictureOutlined className="transition-all duration-700 cursor-pointer dark:text-white" />
                    </Upload>
                    <Upload id="picture" {...props} accept="audio/*" style={{ display: 'none' }}>
                      <CustomerServiceOutlined className="transition-all duration-700 cursor-pointer dark:text-white" />
                    </Upload>
                    <Upload id="file" {...props} style={{ display: 'none' }} accept=".doc,.docx,.xlsx,.pdf,.xls,audio/*,video/*">
                      <FolderOpenOutlined className="transition-all duration-700 cursor-pointer dark:text-white" />
                    </Upload>
                    <Tooltip placement="top" title={'长按录音'}>
                      <AudioOutlined
                        className="transition-all duration-700 cursor-pointer dark:text-white"
                        ref={voiceSpecRef}
                        onMouseUp={handleStopRecord}
                        onMouseLeave={handleStopRecord}
                      />
                    </Tooltip>
                  </div>
                  <div onClick={() => sendTextMessage()}>
                    <SendOutlined className=" transition-all duration-700 cursor-pointer dark:text-white" />
                  </div>
                </div>
                <TextArea
                  ref={textAreaRef}
                  onPressEnter={(e) => sendTextMessage(e)}
                  value={inputValue}
                  placeholder="愉快的聊天吧~"
                  onChange={(e) => {
                    if (e.target.value === '@') {
                      setAtOpen(true)
                    } else {
                      setAtOpen(false)
                    }
                    setInputValue(e.target.value)
                  }}
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

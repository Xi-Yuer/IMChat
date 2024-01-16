import { RootState } from '@/store'
import { ManOutlined, MessageOutlined, WomanOutlined } from '@ant-design/icons'
import { useLongPress } from 'ahooks'
import { Avatar, Popover } from 'antd'
import classNames from 'classnames'
import { FC, memo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { SystemMessageType } from '../../enum/messageType'
import { RoomMessageType } from '../../store/modules/socket'
import { formatDateV2, isBefore30Minutes } from '../../utils/format'
import DocxMessage from '../TypesMessage/DocxMessage'
import ImageMessage from '../TypesMessage/ImageMessage'
import TextMessage from '../TypesMessage/TextMessage'
import VideoMessage from '../TypesMessage/VideoMessage'
import VoiceMessage from '../TypesMessage/VoiceMessage'
import XlsxMessage from '../TypesMessage/XlsxMessage'

const MessageBubble: FC<RoomMessageType & { lastMessageTime: string; longPress: (user: string) => void }> = memo((props) => {
  const {
    message: { content, created_at, message_type, file_name },
    user: { profile_picture, nick_name, origin, id, gender },
    lastMessageTime,
    longPress,
  } = props
  const avatarRef = useRef<HTMLButtonElement>(null)
  const { user } = useSelector((state: RootState) => state.UserReducer)
  useLongPress(() => longPress(nick_name), avatarRef)

  return (
    <>
      {isBefore30Minutes(lastMessageTime, created_at) ? (
        <div className="w-full text-xs text-gray-400 text-center dark:text-gray-400">{formatDateV2(lastMessageTime)}</div>
      ) : null}
      <div
        className={classNames('my-8 flex gap-3 w-full relative', {
          'flex-row-reverse': user.id === id,
        })}
      >
        <Popover
          trigger="click"
          placement="rightTop"
          content={
            <div className="flex flex-col gap-1">
              <span className="cursor-pointer hover:text-blue-500" onClick={() => longPress(nick_name)}>
                @{nick_name}
              </span>
              <div className="cursor-pointer hover:text-blue-500">
                <MessageOutlined />
                <span className="ml-1">发送消息</span>
              </div>
            </div>
          }
        >
          <div className="relative">
            <Avatar src={profile_picture} size={30} ref={avatarRef} />
            <div
              className={classNames('absolute top-[20px]', {
                'left-[-11px] top-[15px]': user.id == id,
                'right-[-10px]': user.id != id,
                'text-pink-500': gender != '1',
                'text-sky-500': gender == '1',
              })}
            >
              {gender === '1' ? <ManOutlined /> : <WomanOutlined className=" rotate-[230deg]" />}
            </div>
          </div>
        </Popover>
        <div className={classNames('flex flex-col')}>
          <span
            className={classNames('dark:text-gray-200 inline-block text-xs mb-1 transition-all duration-700', {
              'text-end': user.id === id,
              'text-start': user.id !== id,
            })}
          >
            {user.id !== id ? (
              <span>
                {nick_name}
                <span className="text-gray-400 text-[12px]">({origin})</span>
              </span>
            ) : (
              <span>
                <span className="text-gray-400 text-[12px]">({origin})</span>
                {nick_name}
              </span>
            )}
          </span>
          {message_type === SystemMessageType.TEXT && (
            <div
              style={{
                borderRadius: user.id === id ? '20px 2px 20px 20px' : '2px 20px 20px',
              }}
              className="min-w-[60px] min-h-[30px] max-w-xs bg-slate-100 dark:bg-[#484b5b] p-3 transition-all duration-700"
            >
              {message_type === SystemMessageType.TEXT && <TextMessage content={content} />}
            </div>
          )}
          <div
            className={classNames('p-3', {
              'text-start': user.id !== id,
              'text-end': user.id === id,
            })}
          >
            {message_type === SystemMessageType.IMAGE && <ImageMessage content={content} />}
            {message_type === SystemMessageType.DOCX && <DocxMessage content={content} file_name={file_name} />}
            {message_type === SystemMessageType.XLSX && <XlsxMessage content={content} file_name={file_name} />}
            {message_type === SystemMessageType.MP4 && <VideoMessage content={content} file_name={file_name} />}
            {message_type === SystemMessageType.MP3 && <VoiceMessage content={content} file_name={file_name} />}
          </div>
        </div>
      </div>
    </>
  )
})

export default MessageBubble

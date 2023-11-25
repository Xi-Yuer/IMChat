import { RootState } from '@/store'
import { ManOutlined, WomanOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import classNames from 'classnames'
import { FC, memo } from 'react'
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

const MessageBubble: FC<RoomMessageType & { lastMessageTime: string }> = memo(
  (props) => {
    const {
      message: { content, created_at, message_type, file_name },
      user: { profile_picture, nick_name, origin, id, gender },
      lastMessageTime,
    } = props
    const { user } = useSelector((state: RootState) => state.UserReducer)
    return (
      <>
        {isBefore30Minutes(lastMessageTime, created_at) ? (
          <div className="w-full text-xs text-gray-400 text-center dark:text-gray-400">
            {formatDateV2(lastMessageTime)}
          </div>
        ) : null}
        <div
          className={classNames('my-8 flex gap-3 w-full relative', {
            'flex-row-reverse': user.id === id,
          })}
        >
          <div className="relative">
            <Avatar src={profile_picture} size={30} />
            <div
              className={classNames('absolute top-[20px]', {
                'left-[-11px] top-[15px]': user.id == id,
                'right-[-10px]': user.id != id,
                'text-pink-500': gender != '1',
                'text-sky-500': gender == '1',
              })}
            >
              {gender === '1' ? (
                <ManOutlined />
              ) : (
                <WomanOutlined className=" rotate-[230deg]" />
              )}
            </div>
          </div>
          <div className={classNames('flex flex-col')}>
            <span
              className={classNames(
                'dark:text-gray-200 inline-block text-xs mb-1 transition-all duration-700',
                {
                  'text-end': user.id === id,
                  'text-start': user.id !== id,
                }
              )}
            >
              {user.id !== id
                ? `${nick_name}(${origin})`
                : `(${origin})${nick_name}`}
            </span>
            {message_type === SystemMessageType.TEXT && (
              <div
                style={{
                  borderRadius:
                    user.id === id ? '20px 2px 20px 20px' : '2px 20px 20px',
                }}
                className={classNames(
                  'min-w-[60px] min-h-[30px] max-w-xs bg-slate-100 dark:bg-sky-500 p-3 transition-all duration-700'
                )}
              >
                {message_type === SystemMessageType.TEXT && (
                  <TextMessage content={content} />
                )}
              </div>
            )}
            {message_type === SystemMessageType.IMAGE && (
              <div
                className={classNames('p-3', {
                  'text-start': user.id !== id,
                  'text-end': user.id === id,
                })}
              >
                <ImageMessage content={content} />
              </div>
            )}
            {message_type === SystemMessageType.DOCX && (
              <div
                className={classNames('p-3', {
                  'text-start': user.id !== id,
                  'text-end': user.id === id,
                })}
              >
                <DocxMessage content={content} />
              </div>
            )}
            {message_type === SystemMessageType.XLSX && (
              <div
                className={classNames('p-3', {
                  'text-start': user.id !== id,
                  'text-end': user.id === id,
                })}
              >
                <XlsxMessage content={content} />
              </div>
            )}
            {message_type === SystemMessageType.MP4 && (
              <div
                className={classNames('p-3', {
                  'text-start': user.id !== id,
                  'text-end': user.id === id,
                })}
              >
                <VideoMessage content={content} />
              </div>
            )}

            {message_type === SystemMessageType.MP3 && (
              <div
                className={classNames('p-3', {
                  'text-start': user.id !== id,
                  'text-end': user.id === id,
                })}
              >
                <VoiceMessage content={content} file_name={file_name} />
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
)

export default MessageBubble

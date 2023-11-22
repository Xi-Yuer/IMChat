import { Avatar } from 'antd'
import { FC, memo } from 'react'
import { RoomMessageType } from '../../store/modules/socket'
import { formatDateV2, isBefore30Minutes } from '../../utils/format'

const MessageBubble: FC<RoomMessageType & { lastMessageTime: string }> = memo(
  (props) => {
    const {
      message: { content, created_at },
      user: { profile_picture, nick_name, origin },
      lastMessageTime,
    } = props
    return (
      <>
        {isBefore30Minutes(lastMessageTime, created_at) ? (
          <div className="w-full text-xs text-gray-400 text-center dark:text-gray-400">
            {formatDateV2(lastMessageTime)}
          </div>
        ) : null}
        <div className="my-8 flex gap-3">
          <div>
            <Avatar src={profile_picture} size={30} />
          </div>
          <div className="flex flex-col">
            <span className="dark:text-gray-200 inline-block transition-all duration-700">
              {nick_name}（{origin}）
            </span>
            <div
              style={{
                borderRadius: '2px 20px 20px',
              }}
              className="min-w-[60px] min-h-[30px] max-w-xs bg-slate-100 dark:bg-sky-500 p-3 transition-all duration-700"
            >
              {content}
            </div>
          </div>
        </div>
      </>
    )
  }
)

export default MessageBubble

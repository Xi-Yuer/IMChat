import { RootState } from '@/store'
import { Avatar } from 'antd'
import classNames from 'classnames'
import { FC, memo } from 'react'
import { useSelector } from 'react-redux'
import { RoomMessageType } from '../../store/modules/socket'
import { formatDateV2, isBefore30Minutes } from '../../utils/format'

const MessageBubble: FC<RoomMessageType & { lastMessageTime: string }> = memo(
  (props) => {
    const {
      message: { content, created_at },
      user: { profile_picture, nick_name, origin, id },
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
          className={classNames('my-8 flex gap-3 w-full', {
            'flex-row-reverse': user.id === id,
          })}
        >
          <div>
            <Avatar src={profile_picture} size={30} />
          </div>
          <div className="flex flex-col">
            <span
              className={classNames(
                'dark:text-gray-200 inline-block text-xs mb-1 transition-all duration-700',
                {
                  'text-end': user.id === id,
                }
              )}
            >
              {nick_name}（{origin}）
            </span>
            <div
              style={{
                borderRadius:
                  user.id === id ? '20px 2px 20px 20px' : '2px 20px 20px',
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

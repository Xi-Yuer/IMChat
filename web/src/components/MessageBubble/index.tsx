import { Avatar } from 'antd'
import { FC, memo } from 'react'
import { RoomMessageType } from 'src/store/modules/socket'

const MessageBubble: FC<RoomMessageType> = memo((props) => {
  const {
    message: { content },
    user: { profile_picture, nick_name },
  } = props
  return (
    <div className="my-8 flex gap-3">
      <div>
        <Avatar src={profile_picture} size={30} />
      </div>
      <div className="flex flex-col">
        <span>{nick_name}</span>
        <div className=" min-w-[60px] min-h-[30px] bg-slate-100 dark:bg-sky-500 rounded-md p-3 transition-all duration-700">
          {content}
        </div>
      </div>
    </div>
  )
})

export default MessageBubble

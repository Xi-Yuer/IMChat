import { Image } from 'antd'
import { FC, memo } from 'react'
import ErrorImage from '../../assets/image/error'
import { useChangeCurrentRoom } from '../../hooks/useChangeCurrentRoom'
import { IChatRoomResponse } from '../../server/apis/chatRoom'
import { formatDate } from '../../utils/format'

const RoomPanel: FC<IChatRoomResponse> = memo((room) => {
  const { name, description, avatar, current_msg, current_msg_time } = room
  const { roomChangeHandle } = useChangeCurrentRoom(room)
  return (
    <div
      onClick={roomChangeHandle}
      className="flex text-gray-900 transition-all duration-700 justify-between items-center bg-gray-50 dark:bg-gray-700 h-[55px] rounded-md px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      <div className="flex-1">
        <Image
          src={avatar}
          width={40}
          preview={false}
          className="rounded-full border border-gray-200 w-[40px] h-[40px]"
          fallback={ErrorImage}
        />
      </div>
      <div className="flex flex-col justify-between w-[100px] ml-[-20px]">
        <span className="font-bold text-sm dark:text-gray-200 transition-all duration-700">
          {name}
        </span>
        <span className="truncate text-xs dark:text-gray-400 transition-all duration-700">
          {current_msg ? current_msg : description}
        </span>
      </div>
      <div className="flex-1 text-end">
        <span className="text-xs dark:text-gray-200 transition-all duration-700">
          {formatDate(current_msg_time, 'HH:mm')}
        </span>
      </div>
    </div>
  )
})

export default RoomPanel

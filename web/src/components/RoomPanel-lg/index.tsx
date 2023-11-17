import { Image } from 'antd'
import { FC, memo } from 'react'
import { useDispatch } from 'react-redux'
import ErrorImage from '../../assets/image/error'
import { getRoomUserListRequest } from '../../server/apis/chatRoom'
import {
  changeCurrentRoom,
  changeCurrentRoomUserList,
} from '../../store/modules/chatRoom'

export interface IRoomPanelProps {
  id: string
  name: string
  avatar: string
  description?: string
  current_msg?: string
  current_mag_time?: number
}

const RoomPanel: FC<IRoomPanelProps> = memo((room) => {
  const { name, description, avatar, current_msg, current_mag_time } = room
  const dispatch = useDispatch()
  const roomClickHandle = () => {
    dispatch(changeCurrentRoom(room))
    getRoomUserListRequest(room.id).then((res) => {
      dispatch(changeCurrentRoomUserList(res.data))
    })
  }
  return (
    <div
      onClick={roomClickHandle}
      className="flex text-gray-900 transition-all duration-700 justify-between items-center bg-gray-50 dark:bg-gray-700 h-[55px] rounded-md px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      <div>
        <Image
          src={avatar}
          width={40}
          className="rounded-full border border-gray-200 w-[40px] h-[40px]"
          fallback={ErrorImage}
        />
      </div>
      <div className="flex flex-col justify-between w-[100px] ml-[-20px]">
        <span className="font-bold text-sm dark:text-gray-200 ">{name}</span>
        <span className="truncate text-xs dark:text-gray-400 transition-all duration-700">
          {description}
          {current_msg}
        </span>
      </div>
      <div>
        <span className="text-xs dark:text-gray-200 transition-all duration-700">
          {current_mag_time}
        </span>
      </div>
    </div>
  )
})

export default RoomPanel

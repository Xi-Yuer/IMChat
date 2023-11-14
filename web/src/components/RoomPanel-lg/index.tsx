import { FC, memo } from 'react'

export interface IRoomPanelProps {
  roomName: string
  currentMsg: string
  roomAvatar: string
  time: string
}

const RoomPanel: FC<IRoomPanelProps> = memo(
  ({ roomAvatar, roomName, currentMsg, time }) => {
    return (
      <div className="flex text-gray-900 transition-all duration-700 justify-between items-center dark:bg-gray-600 h-[55px] rounded-md px-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500">
        <div>
          <img
            src={roomAvatar}
            className="rounded-full border border-gray-200 w-[40px] h-[40px]"
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between w-[100px] ml-[-20px]">
          <span className="font-bold text-sm dark:text-gray-200 ">
            {roomName}
          </span>
          <span className="truncate text-xs dark:text-gray-400 transition-all duration-700">
            {currentMsg}
          </span>
        </div>
        <div>
          <span className="text-xs dark:text-gray-200 transition-all duration-700">
            {time}
          </span>
        </div>
      </div>
    )
  }
)

export default RoomPanel

import { FC, memo } from 'react'

export interface IRoomPanelProps {
  id: number
  roomName: string
  currentMsg: string
  roomAvatar: string
  time: string
}

const RoomPanel: FC<IRoomPanelProps> = memo(
  ({ roomAvatar, roomName, currentMsg, time }) => {
    return (
      <div className="flex transition-all duration-200 justify-between items-center bg-gray-100 dark:bg-gray-600 gap-2 cursor-pointer p-2 mr-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500">
        <div>
          <img
            src={roomAvatar}
            className="rounded-full w-6 h-6 border border-gray-200"
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between w-[100px]">
          <span className=" font-bold text-xs">{roomName}</span>
          <span className="truncate inline-block mt-1 text-xs">
            {currentMsg}
          </span>
        </div>
        <div>
          <span className="text-xs">{time}</span>
        </div>
      </div>
    )
  }
)

export default RoomPanel

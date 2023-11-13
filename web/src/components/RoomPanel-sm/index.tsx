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
      <div className="flex transition-all duration-200 justify-between items-center gap-2 cursor-pointer bg-gray-400 p-2 mr-2 rounded-lg hover:bg-gray-300">
        <div>
          <img
            src={roomAvatar}
            className="rounded-full w-6 h-6 border border-gray-200"
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between w-[100px]">
          <span className=" font-bold">{roomName}</span>
          <span className="truncate text-white text-xs">{currentMsg}</span>
        </div>
        <div>
          <span className="text-xs">{time}</span>
        </div>
      </div>
    )
  }
)

export default RoomPanel

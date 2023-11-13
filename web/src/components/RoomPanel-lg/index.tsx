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
      <div className="flex transition-all duration-200 justify-between items-center bg-gray-600 h-[55px] rounded-md px-2 cursor-pointer hover:bg-gray-500">
        <div>
          <img
            src={roomAvatar}
            className="rounded-full border border-gray-200 w-[40px] h-[40px]"
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between w-[100px] text-xs ml-[-20px]">
          <span className=" font-bold">{roomName}</span>
          <span className="truncate text-gray-400">{currentMsg}</span>
        </div>
        <div>
          <span className="text-xs">{time}</span>
        </div>
      </div>
    )
  }
)

export default RoomPanel

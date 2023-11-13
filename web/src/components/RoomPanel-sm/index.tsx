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
      <div className="flex justify-between items-center gap-4 px-2">
        <div>
          <img
            src={roomAvatar}
            className="rounded-full w-6 h-6 border border-gray-200"
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between w-[100px] text-xs">
          <span className=" font-bold">{roomName}</span>
          <span className="truncate text-gray-600">{currentMsg}</span>
        </div>
        <div>
          <span className="text-xs">{time}</span>
        </div>
      </div>
    )
  }
)

export default RoomPanel

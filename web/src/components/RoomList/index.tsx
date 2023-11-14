import { memo } from 'react'
import { roomList } from '../Profile/const'
import RoomPanel from '../RoomPanel-lg'

const RoomList = memo(() => {
  return (
    <div className="hidden lg:block w-[250px] h-full border-r dark:border-[#343642] flex-col gap-4 py-4 px-2 overflow-hidden">
      {roomList.map((room) => {
        return (
          <div className="mb-2 text-[#f0f0f0]" key={room.id}>
            <RoomPanel {...room} />
          </div>
        )
      })}
    </div>
  )
})

export default RoomList

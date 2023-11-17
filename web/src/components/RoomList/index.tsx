import { memo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import RoomPanel from '../RoomPanel-lg'

const RoomList = memo(() => {
  const list = useSelector((state: RootState) => state.UserReducer.roomList)
  return (
    <div className="hidden lg:block w-[250px] h-full border-r dark:border-[#343642] flex-col gap-4 py-4 px-2 overflow-hidden">
      {list.map((room) => {
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

import { SmileOutlined } from '@ant-design/icons'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import RoomPanelLg from '../RoomPanel-lg'

const RoomList = memo(() => {
  const list = useSelector((state: RootState) => state.UserReducer.roomList)
  return (
    <div className="hidden lg:block w-[250px] h-full border-r border-dashed dark:border-[#3b3d4b] flex-col gap-4 py-4 px-2 overflow-hidden transition-all duration-700">
      {list.map((room) => {
        return (
          <div className="mb-2 text-[#f0f0f0]" key={room.id}>
            <RoomPanelLg {...room} />
          </div>
        )
      })}
      {list.length === 0 && (
        <div className="w-full h-full flex justify-center items-center dark:text-gray-300">
          <div className="mt-[-150px]">
            <SmileOutlined className="mr-2" />
            暂无数据
          </div>
        </div>
      )}
    </div>
  )
})

export default RoomList

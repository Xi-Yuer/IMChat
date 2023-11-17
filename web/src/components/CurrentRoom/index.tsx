import { RootState } from '@/store'
import { SmileOutlined } from '@ant-design/icons'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import UserPanel from '../UserPanel'

const CurrentRoom = memo(() => {
  const { currentChatRoom, currentChatRoomUserList } = useSelector(
    (state: RootState) => state.ChatRoomReducer
  )
  return (
    <div className="p-1 flex-1 flex">
      <div className="flex-1 border-r border-dashed dark:border-[#3b3d4b] transition-all duration-700">
        <h2>{currentChatRoom.name}</h2>
      </div>
      <div className="w-[180px] hidden xl:block px-2">
        {currentChatRoomUserList.map((user) => (
          <UserPanel {...user} key={user.id} />
        ))}
        {currentChatRoomUserList.length === 0 && (
          <div className="w-full h-full flex justify-center items-center dark:text-gray-300">
            <div className="mt-[-150px]">
              <SmileOutlined className="mr-2" />
              暂无数据
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default CurrentRoom

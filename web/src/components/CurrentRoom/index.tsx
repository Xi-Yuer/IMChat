import { RootState } from '@/store'
import { SmileOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import UserPanel from '../UserPanel'

const CurrentRoom = memo(() => {
  const { currentChatRoom, currentChatRoomUserList } = useSelector(
    (state: RootState) => state.ChatRoomReducer
  )
  const { currentRoomLoading, currentRoomUserListLoading } = useSelector(
    (state: RootState) => state.UIReducer
  )
  return (
    <>
      {currentChatRoom.id ? (
        <div className="p-1 flex-1 flex">
          <div className="flex-1 border-r border-dashed dark:border-[#3b3d4b] transition-all duration-700">
            <Spin spinning={currentRoomLoading}>
              <h2>{currentChatRoom.name}</h2>
            </Spin>
          </div>
          <Spin spinning={currentRoomUserListLoading}>
            <div className="w-[180px] overflow-hidden hidden xl:block px-2">
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
          </Spin>
        </div>
      ) : null}
    </>
  )
})

export default CurrentRoom

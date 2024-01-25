import { RootState } from '@/store'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import CurrentRoom from '../../components/CurrentRoom/index'
import Empty from '../../components/Empty'
import Profile from '../../components/Profile'
import RoomList from '../../components/RoomList/index'
import { useScreen } from '../../hooks/useScreen'
import { InnerStyle, WrapperStyle } from './style'

const Home = memo(() => {
  const { currentChatRoom } = useSelector((state: RootState) => state.ChatRoomReducer)
  const { isMobile } = useScreen()
  return (
    <div className={WrapperStyle(isMobile)}>
      <div className={InnerStyle(isMobile)}>
        <Profile />
        <RoomList />
        {currentChatRoom?.id ? <CurrentRoom /> : <Empty />}
      </div>
      {!isMobile && (
        <div className=" absolute bottom-[20px] dark:text-gray-200 w-full flex justify-center">
          <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">
            备案号： 蜀ICP备2022015920号-1
          </a>
        </div>
      )}
    </div>
  )
})

export default Home

import { RootState } from '@/store'
import ParticlesBg from 'particles-bg'
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
      {!isMobile && <ParticlesBg type="tadpole" bg={true} />}
      <div className={InnerStyle(isMobile)}>
        <Profile />
        <RoomList />
        {currentChatRoom?.id ? <CurrentRoom /> : <Empty />}
      </div>
    </div>
  )
})

export default Home

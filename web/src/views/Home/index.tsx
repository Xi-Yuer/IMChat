import ParticlesBg from 'particles-bg'
import { memo } from 'react'
import CurrentRoom from '../../components/CurrentRoom/index'
import Profile from '../../components/Profile'
import RoomList from '../../components/RoomList/index'
import { useScreen } from '../../hooks/useScreen'
import { InnerStyle, WrapperStyle } from './style'

const Home = memo(() => {
  const { isMobile } = useScreen()
  return (
    <div className={WrapperStyle(isMobile)}>
      {!isMobile && <ParticlesBg type="tadpole" bg={true} />}
      <div className={InnerStyle(isMobile)}>
        <Profile />
        <RoomList />
        <CurrentRoom />
      </div>
    </div>
  )
})

export default Home

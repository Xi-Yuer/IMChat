import ParticlesBg from 'particles-bg'
import { memo } from 'react'
import Profile from '../../components/Profile'
import RoomList from '../../components/RoomList/index'
const Home = memo(() => {
  return (
    <div className=" backdrop-blur-3xl bg-gray-600 w-screen h-screen flex items-center justify-center">
      <ParticlesBg type="tadpole" bg={true} />
      <div className="w-[80%] h-[80%] bg-[#282a36] rounded-lg flex">
        <Profile />
        <RoomList />
      </div>
    </div>
  )
})

export default Home

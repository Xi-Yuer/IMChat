import ParticlesBg from 'particles-bg'
import { memo } from 'react'
import Profile from '../../components/Profile'
import RoomList from '../../components/RoomList/index'
const Home = memo(() => {
  return (
    <div className=" backdrop-blur-3xl bg-gray-200 w-screen h-screen flex items-center justify-center dark:bg-gray-600 transition-all duration-700">
      <ParticlesBg type="tadpole" bg={true} />
      <div className="w-[80%] h-[80%] min-h-[500px] min-w-[600px] bg-white rounded-lg flex select-none dark:bg-[#333643] transition-all duration-700">
        <Profile />
        <RoomList />
      </div>
    </div>
  )
})

export default Home

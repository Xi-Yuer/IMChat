import { memo } from 'react'
import { Outlet } from 'react-router-dom'

const Home = memo(() => {
  return (
    <div>
      <div>Home</div>
      <Outlet />
    </div>
  )
})

export default Home

import { RootState } from '@/store'
import { GithubFilled, MessageOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { memo, useRef } from 'react'
import { useSelector } from 'react-redux'
import Login, { OpenModal } from '../Login'

const Profile = memo(() => {
  const LoginRef = useRef<OpenModal>(null)
  const loginAction = () => LoginRef.current?.open()
  const user = useSelector((state: RootState) => state.UserStore.user)

  return (
    <>
      <div className="w-[80px] h-full flex justify-between flex-col py-4 border-r border-[#343642]">
        <div className="flex items-center flex-col gap-4">
          {user.profile_picture ? (
            <Avatar
              size={45}
              src={<img src={user.profile_picture} alt="avatar" />}
              className="cursor-pointer bg-gray-200 text-black"
              onClick={loginAction}
            />
          ) : (
            <Avatar
              size={45}
              icon={<UserOutlined />}
              className="cursor-pointer bg-gray-200 text-black"
              onClick={loginAction}
            />
          )}
          <div className="w-[50px] h-[50px] justify-center items-center flex rounded-lg bg-[#333643] cursor-pointer">
            <MessageOutlined className="text-2xl text-gray-200 hover:text-[#52b3d0] transition-all" />
          </div>
        </div>
        <div className="flex items-center flex-col gap-4 cursor-pointer">
          <GithubFilled className="text-3xl text-gray-200" />
        </div>
      </div>
      <Login ref={LoginRef} />
    </>
  )
})

export default Profile

import { RootState } from '@/store'
import {
  GithubFilled,
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Popover } from 'antd'
import classNames from 'classnames'
import { memo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Login, { OpenModal } from '../Login'
import RoomPanel from '../RoomPanel-sm'
import { iconStyle, iconWrapStyle, roomList } from './const'

const Profile = memo(() => {
  const LoginRef = useRef<OpenModal>(null)
  const user = useSelector((state: RootState) => state.UserStore.user)
  const [currentActive, setCurrentActive] = useState(1)

  const chatRoomList = () => {
    return (
      <div className="flex flex-col gap-4 max-h-48 scrollbar-w-2 overflow-y-scroll">
        {roomList.map((room) => (
          <RoomPanel {...room} />
        ))}
      </div>
    )
  }
  const avatarType = () => {
    return user.profile_picture ? (
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
    )
  }

  const loginAction = () => LoginRef.current?.open()
  const sideBarItemClick = (_: number) => setCurrentActive(_)

  return (
    <>
      <div className="w-[80px] h-full flex justify-between flex-col py-4 border-r border-[#343642]">
        <div className="flex items-center flex-col gap-4">
          {avatarType()}
          <div
            className={classNames(iconWrapStyle, {
              'bg-[#333643]': currentActive === 1,
            })}
            onClick={() => sideBarItemClick(1)}
          >
            <MessageOutlined className={iconStyle} />
          </div>
          <div
            className={classNames(
              iconWrapStyle,
              {
                'bg-[#333643]': currentActive === 2,
              },
              'lg:hidden'
            )}
            onClick={() => sideBarItemClick(2)}
          >
            <Popover
              content={chatRoomList}
              trigger="click"
              placement="right"
              arrow={{ pointAtCenter: true }}
            >
              <TeamOutlined className={iconStyle} />
            </Popover>
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

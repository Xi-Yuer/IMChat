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
import { useDispatch, useSelector } from 'react-redux'
import darkImg from '../../assets/image/darlk.png'
import lightImg from '../../assets/image/light.png'
import Login, { OpenModal } from '../Login'
import RoomPanel from '../RoomPanel-sm'
import { iconStyle, iconWrapStyle, roomList } from './const'
import { themeChange } from '../../store/modules/ui'

const Profile = memo(() => {
  const LoginRef = useRef<OpenModal>(null)
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.UserReducer.user)
  const theme = useSelector((state: RootState) => state.UIReducer.theme)
  const [currentActive, setCurrentActive] = useState(1)

  const chatRoomList = () => {
    return (
      <div className="flex flex-col gap-2 max-h-48 scrollbar-w-2 overflow-y-scroll">
        {roomList.map((room) => (
          <RoomPanel {...room} key={room.id} />
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
  const thmeChangeAction = () => {
    dispatch(themeChange(theme === 'light' ? 'dark' : 'light'))
  }

  return (
    <>
      <div className="w-[80px] h-full flex justify-between flex-col py-4 border-r dark:border-[#464958] transition-all duration-700">
        <div className="flex items-center flex-col gap-4">
          {avatarType()}
          <div
            className={classNames(iconWrapStyle, {
              'bg-[#ececec] dark:bg-[#474b5c]': currentActive === 1,
            })}
            onClick={() => sideBarItemClick(1)}
          >
            <MessageOutlined className={iconStyle} />
          </div>
          <div
            className={classNames(
              iconWrapStyle,
              {
                'bg-[#ececec] dark:bg-[#474b5c]': currentActive === 2,
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
          <div className="mb-4" onClick={thmeChangeAction}>
            {theme === 'dark' ? (
              <img src={darkImg} alt="" className="w-[25px] h-[25px]" />
            ) : (
              <img src={lightImg} alt="" className="w-[25px] h-[25px]" />
            )}
          </div>
          <GithubFilled className="text-3xl dark:text-gray-200" />
        </div>
      </div>
      <Login ref={LoginRef} />
    </>
  )
})

export default Profile
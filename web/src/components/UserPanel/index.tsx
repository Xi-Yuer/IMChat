import { Image, Popover } from 'antd'
import classNames from 'classnames'
import { memo } from 'react'
import { ILoginResponse } from '../../server/apis/user'

const UserPanel = memo((user: Omit<ILoginResponse, 'token'> & { active: boolean }) => {
  const moreUserInfo = () => {
    return (
      <div className="w-[150px] max-w-[200px]">
        <div>
          <span>性别：{user.gender === '1' ? '男' : '女'}</span>
        </div>
        <div>
          <span>归属地：{user.origin}</span>
        </div>
        <div className="whitespace-normal">
          <span>签名：{user.bio}</span>
        </div>
      </div>
    )
  }
  return (
    <>
      <Popover content={moreUserInfo} placement="bottom" trigger={'click'}>
        <div className="flex items-center gap-2 my-2 cursor-pointer">
          <div className="flex items-center justify-center relative">
            <Image
              src={user.profile_picture}
              width={30}
              height={30}
              className={classNames('rounded-full', {
                grayscale: !user.active,
              })}
              preview={false}
            />
            <span
              className={classNames('w-2 h-2 rounded-full absolute right-[-2px] bottom-0 transition-all duration-700', {
                'bg-[#adff2f]': user.active,
                'bg-gray-400': !user.active,
              })}
            ></span>
          </div>
          <div className="truncate transition-all duration-700 dark:text-gray-200">
            <span className="text-md">{user.nick_name}</span>
          </div>
        </div>
      </Popover>
    </>
  )
})

export default UserPanel

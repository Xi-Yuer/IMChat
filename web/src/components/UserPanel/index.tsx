import { Image } from 'antd'
import classNames from 'classnames'
import { memo } from 'react'
import { ILoginResponse } from '../../server/apis/user'

const UserPanel = memo(
  (user: Omit<ILoginResponse, 'token'> & { active: boolean }) => {
    return (
      <div>
        <div className="flex items-center gap-2 my-2 cursor-pointer">
          <div className="flex items-center justify-center relative">
            <Image
              src={user.profile_picture}
              width={30}
              className="rounded-full"
            />
            <span
              className={classNames(
                'w-2 h-2 rounded-full absolute right-[-2px] bottom-0 transition-all duration-700',
                {
                  'bg-[#adff2f]': user.active,
                  'bg-gray-500': !user.active,
                }
              )}
            ></span>
          </div>
          <div>
            <span className="text-md transition-all duration-700 dark:text-gray-200">
              {user.nick_name}
            </span>
          </div>
        </div>
      </div>
    )
  }
)

export default UserPanel

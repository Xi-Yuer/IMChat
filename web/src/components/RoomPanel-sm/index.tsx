import { Image } from 'antd'
import { FC, memo } from 'react'
import ErrorImage from '../../assets/image/error'
import { IRoomPanelProps } from '../RoomPanel-lg'

const RoomPanel: FC<IRoomPanelProps> = memo(({ name, avatar }) => {
  return (
    <div className="flex transition-all duration-200 justify-between items-center bg-gray-100 dark:bg-gray-700 gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
      <div className="flex justify-center items-center rounded-full">
        <Image
          src={avatar}
          width={30}
          height={30}
          className="rounded-full border border-gray-200 w-[40px] h-[40px]"
          fallback={ErrorImage}
        />
      </div>
      <div className="flex flex-col justify-between w-[100px]">
        <span className=" font-bold text-xs">{name}</span>
      </div>
    </div>
  )
})

export default RoomPanel

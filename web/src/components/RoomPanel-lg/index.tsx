import { RootState } from '@/store'
import { Image } from 'antd'
import { FC, memo } from 'react'
import { useSelector } from 'react-redux'
import ErrorImage from '../../assets/image/error'
import { SystemMessageType } from '../../enum/messageType'
import { useChangeCurrentRoom } from '../../hooks/useChangeCurrentRoom'
import { IChatRoomResponse } from '../../server/apis/chatRoom'
import { formatDate } from '../../utils/format'

const RoomPanel: FC<IChatRoomResponse> = memo((room) => {
  const { name, description, avatar, current_msg, current_msg_time, id } = room
  const { roomChangeHandle } = useChangeCurrentRoom(room)
  const { roomMessageList } = useSelector((state: RootState) => state.SocketReducer)

  const recentMessage = () => {
    if (roomMessageList[id]?.length > 0) {
      if (roomMessageList[id][roomMessageList[id].length - 1].message.message_type === SystemMessageType.TEXT) {
        return {
          user: roomMessageList[id][roomMessageList[id].length - 1].user.nick_name + '：',
          msg: roomMessageList[id][roomMessageList[id].length - 1].message.content,
          time: roomMessageList[id][roomMessageList[id].length - 1].message.created_at,
        }
      }
      if (roomMessageList[id][roomMessageList[id].length - 1].message.message_type === SystemMessageType.VOICE) {
        return {
          user: roomMessageList[id][roomMessageList[id].length - 1].user.nick_name + '：',
          msg: '[语音]',
          time: roomMessageList[id][roomMessageList[id].length - 1].message.created_at,
        }
      }
      if (roomMessageList[id][roomMessageList[id].length - 1].message.message_type === SystemMessageType.IMAGE) {
        return {
          user: roomMessageList[id][roomMessageList[id].length - 1].user.nick_name + '：',
          msg: '[图片]',
          time: roomMessageList[id][roomMessageList[id].length - 1].message.created_at,
        }
      }
      if (roomMessageList[id][roomMessageList[id].length - 1].message.message_type === SystemMessageType.MP3) {
        return {
          user: roomMessageList[id][roomMessageList[id].length - 1].user.nick_name + '：',
          msg: '[音频文件]',
          time: roomMessageList[id][roomMessageList[id].length - 1].message.created_at,
        }
      }
      if (roomMessageList[id][roomMessageList[id].length - 1].message.message_type === SystemMessageType.MP4) {
        return {
          user: roomMessageList[id][roomMessageList[id].length - 1].user.nick_name + '：',
          msg: '[视频文件]',
          time: roomMessageList[id][roomMessageList[id].length - 1].message.created_at,
        }
      }
      if (
        roomMessageList[id][roomMessageList[id].length - 1].message.message_type === SystemMessageType.XLSX ||
        roomMessageList[id][roomMessageList[id].length - 1].message.message_type === SystemMessageType.DOCX
      ) {
        return {
          user: roomMessageList[id][roomMessageList[id].length - 1].user.nick_name + '：',
          msg: '[文档]',
          time: roomMessageList[id][roomMessageList[id].length - 1].message.created_at,
        }
      }
    } else {
      return {
        msg: description || current_msg,
        time: current_msg_time,
      }
    }
  }
  return (
    <div
      onClick={roomChangeHandle}
      className="flex text-gray-900 transition-all duration-700 justify-between items-center bg-gray-50 dark:bg-gray-700 h-[55px] rounded-md px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      <div className="flex-1">
        <Image src={avatar} width={40} preview={false} className="rounded-full border border-gray-200 w-[40px] h-[40px]" fallback={ErrorImage} />
      </div>
      <div className="flex flex-col justify-between w-[100px] ml-[-20px]">
        <span className="font-bold text-sm dark:text-gray-200 transition-all duration-700">{name}</span>
        <span className="truncate text-[10px] dark:text-gray-400 transition-all duration-700 w-[120px]">
          {recentMessage()?.user}
          {recentMessage()?.msg}
        </span>
      </div>
      <div className="flex-1 text-end">
        <span className="text-xs dark:text-gray-200 transition-all duration-700">{formatDate(recentMessage()!.time, 'HH:mm')}</span>
      </div>
    </div>
  )
})

export default RoomPanel

import { AxiosResponse } from 'axios'
import request from '../request'

export interface IChatRoomResponse {
  name: string
  description: string
  avatar: string
  id: string
  create_at: string
  current_msg: string
  current_msg_time: number
}
export const getUserChatRoom = () => {
  return request.get<AxiosResponse<IChatRoomResponse[]>>({
    url: '/chatroom/list',
  })
}

export const getRoomUserListRequest = (chat_room_id: string) => {
  return request.get({
    url: '/chatroom/user_list',
    params: {
      chat_room_id,
    },
  })
}

import { AxiosResponse } from 'axios'
import { SystemMessageType } from '../../enum/messageType'
import request from '../request'
import { ILoginResponse } from './user'

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

export interface IChatMessageResponse {
  message: {
    content: string
    create_at: string
    group_id: string
    message_type: SystemMessageType
  }
  user: Omit<ILoginResponse, 'token'>
}
export const getRoomMsgListRequest = (chat_room_id: string, limit: number = 20, offset: number = 1) => {
  return request.get<AxiosResponse<IChatMessageResponse[]>>({
    url: '/message/list',
    params: {
      chat_room_id,
      limit,
      offset,
    },
  })
}

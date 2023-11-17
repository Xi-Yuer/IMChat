import request from '../request'

export const getRoomUserListRequest = (chat_room_id: string) => {
  return request.get({
    url: '/chatroom/user_list',
    params: {
      chat_room_id,
    },
  })
}

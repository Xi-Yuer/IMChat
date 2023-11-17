import { useDispatch } from 'react-redux'
import { IChatRoomResponse } from '../server/apis/user'
import {
  changeCurrentRoom,
  changeCurrentRoomUserList,
} from '../store/modules/chatRoom'
import { getRoomUserListRequest } from '../server/apis/chatRoom'

export const useChangeCurrentRoom = (room: IChatRoomResponse) => {
  const dispatch = useDispatch()
  const roomChangeHandle = () => {
    dispatch(changeCurrentRoom(room))
    getRoomUserListRequest(room.id).then((res) => {
      dispatch(changeCurrentRoomUserList(res.data))
    })
  }
  return {
    roomChangeHandle,
  }
}

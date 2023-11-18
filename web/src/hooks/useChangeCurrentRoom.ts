import { useDispatch } from 'react-redux'
import {
  IChatRoomResponse,
  getRoomUserListRequest,
} from '../server/apis/chatRoom'
import {
  changeCurrentRoom,
  changeCurrentRoomUserList,
} from '../store/modules/chatRoom'
import { changeCurrentRoomUserListLoading } from '../store/modules/ui'

export const useChangeCurrentRoom = (room: IChatRoomResponse) => {
  const dispatch = useDispatch()
  const roomChangeHandle = () => {
    dispatch(changeCurrentRoom(room))
    dispatch(changeCurrentRoomUserListLoading(true))
    getRoomUserListRequest(room.id)
      .then((res) => {
        dispatch(changeCurrentRoomUserList(res.data))
      })
      .finally(() => {
        dispatch(changeCurrentRoomUserListLoading(false))
      })
  }
  return {
    roomChangeHandle,
  }
}

import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import {
  IChatRoomResponse,
  getRoomMsgListRequest,
  getRoomUserListRequest,
} from '../server/apis/chatRoom'
import {
  changeCurrentRoom,
  changeCurrentRoomUserList,
} from '../store/modules/chatRoom'
import { changeRoomMessageListByRoomId } from '../store/modules/socket'
import {
  changeCurrentRoomLoading,
  changeCurrentRoomUserListLoading,
} from '../store/modules/ui'

export const useChangeCurrentRoom = (room: IChatRoomResponse) => {
  const dispatch = useDispatch()
  const { currentChatRoom } = useSelector(
    (state: RootState) => state.ChatRoomReducer
  )
  const roomChangeHandle = () => {
    if (currentChatRoom.id === room.id) return
    dispatch(changeCurrentRoom(room))
    dispatch(changeCurrentRoomUserListLoading(true))
    getRoomUserListRequest(room.id)
      .then((res) => {
        dispatch(changeCurrentRoomUserList(res.data))
      })
      .finally(() => {
        dispatch(changeCurrentRoomUserListLoading(false))
      })
    dispatch(changeCurrentRoomLoading(true))
    getRoomMsgListRequest(room.id, 20, 1)
      .then((res) => {
        dispatch(
          changeRoomMessageListByRoomId({ room_id: room.id, message: res.data })
        )
      })
      .finally(() => {
        dispatch(changeCurrentRoomLoading(false))
      })
  }
  return {
    roomChangeHandle,
  }
}

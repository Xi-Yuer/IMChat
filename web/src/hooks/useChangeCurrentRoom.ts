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
  const roomChangeHandle = async () => {
    if (currentChatRoom.id === room.id) return
    dispatch(changeCurrentRoom(room))

    // 群用户列表
    try {
      dispatch(changeCurrentRoomUserListLoading(true))
      const result = await getRoomUserListRequest(room.id)
      dispatch(changeCurrentRoomUserList(result.data))
    } finally {
      dispatch(changeCurrentRoomUserListLoading(false))
    }

    // 群消息列表
    try {
      dispatch(changeCurrentRoomLoading(true))
      const roomMessageList = await getRoomMsgListRequest(room.id, 20, 1)
      dispatch(
        changeRoomMessageListByRoomId({
          room_id: room.id,
          message: roomMessageList.data,
        })
      )
    } finally {
      dispatch(changeCurrentRoomLoading(false))
    }
  }
  return {
    roomChangeHandle,
  }
}

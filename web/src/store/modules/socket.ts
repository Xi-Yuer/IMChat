import { createSlice } from '@reduxjs/toolkit'
import { ILoginResponse } from '../../server/apis/user'

export interface RoomMessageType {
  user: Omit<ILoginResponse, 'token'>
  message: {
    created_at: string
    content: string
    message_type: string
    group_id: string
  }
}

const initialState = {
  roomMessageList: {} as { [key: string]: RoomMessageType[] },
}
export const useSocketStore = createSlice({
  name: 'socketStore',
  initialState,
  reducers: {
    changeRoomMessageList(state, actions) {
      console.log(actions.payload.message.group_id)

      if (state.roomMessageList[actions.payload.message.group_id]) {
        state.roomMessageList[actions.payload.message.group_id].push(
          actions.payload
        )
      } else {
        state.roomMessageList[actions.payload.message.group_id] = [
          actions.payload,
        ]
      }
    },
  },
})

export const { changeRoomMessageList } = useSocketStore.actions
export default useSocketStore.reducer

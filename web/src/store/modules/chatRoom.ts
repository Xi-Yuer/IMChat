import { createSlice } from '@reduxjs/toolkit'
import { IChatRoomResponse } from '../../server/apis/chatRoom'
import { ILoginResponse } from '../../server/apis/user'

const initialState = {
  currentChatRoom: {} as IChatRoomResponse,
  currentChatRoomUserList: [] as (Omit<ILoginResponse, 'token'> & {
    active: boolean
  })[],
}
export const useChatRoomStore = createSlice({
  name: 'chatRoom',
  initialState,
  reducers: {
    changeCurrentRoom(state, action) {
      state.currentChatRoom = action.payload
    },
    changeCurrentRoomUserList(state, action) {
      state.currentChatRoomUserList = action.payload
    },
  },
})

export const { changeCurrentRoom, changeCurrentRoomUserList } =
  useChatRoomStore.actions
export default useChatRoomStore.reducer

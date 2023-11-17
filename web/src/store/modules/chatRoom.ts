import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentChatRoom: {},
  currentChatRoomUserList: [],
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

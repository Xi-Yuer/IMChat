import { createSlice } from '@reduxjs/toolkit'
import { IChatRoomResponse } from '../../server/apis/chatRoom'
import { type ILoginResponse } from '../../server/apis/user'

interface IUserStore {
  user: ILoginResponse
  roomList: IChatRoomResponse[]
}

const initialState = {
  user: {},
  roomList: [] as IChatRoomResponse[],
} as IUserStore

export const UserStore = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    userLogin(state, action) {
      state.user = action.payload
    },
    changeRoomList(state, action) {
      state.roomList = action.payload
    },
    userLogOut() {
      window.sessionStorage.clear()
      window.location.reload()
    },
    changeUserProfile(state, action) {
      state.user = action.payload
    },
  },
})

export const { userLogin, userLogOut, changeUserProfile, changeRoomList } =
  UserStore.actions
export default UserStore.reducer

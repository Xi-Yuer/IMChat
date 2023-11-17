import { createSlice } from '@reduxjs/toolkit'
import {
  type IChatRoomResponse,
  type ILoginResponse,
} from '../../server/apis/user'

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
    userLogOut(state) {
      state.user.nick_name = ''
      state.user.token = ''
      state.user.account = ''
      state.user.bio = ''
      state.user.profile_picture = ''
      state.user.id = ''
      state.user.gender = '1'
      state.user.origin = ''
      state.user.last_login = ''
    },
    changeUserProfile(state, action) {
      state.user = action.payload
    },
  },
})

export const { userLogin, userLogOut, changeUserProfile, changeRoomList } =
  UserStore.actions
export default UserStore.reducer

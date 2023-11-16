import { createSlice } from '@reduxjs/toolkit'
import { ILoginResponse, getUserChatRoom } from '../../server/apis/user'

interface IUserStore {
  user: ILoginResponse
}

const initialState = {
  user: {},
} as IUserStore

export const UserStore = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    userLogin(state, action) {
      state.user = action.payload
      getUserChatRoom().then(res => {
        console.log(res);
      })
    },
    userLogOut(state) {
      state.user.nick_name = ''
      state.user.token = ''
      state.user.account = ''
      state.user.bio = ''
      state.user.profile_picture = ''
      state.user.id = ''
      state.user.gender = '1'
      state.user.origin = '1'
      state.user.last_login = '1'
    },
    changeUserProfile(state, action) {
      state.user = action.payload
    },
  },
})

export const { userLogin, userLogOut, changeUserProfile } = UserStore.actions
export default UserStore.reducer

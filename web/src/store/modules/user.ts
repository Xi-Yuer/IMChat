import { createSlice } from '@reduxjs/toolkit'
import { ILoginResponse } from 'src/server/apis/user'

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
    },
    userLogOut(state) {
      state.user.account = ''
      state.user.token = ''
      state.user.account = ''
      state.user.bio = ''
      state.user.profile_picture = ''
      state.user.id = ''
      state.user.gender = '1'
    },
    changeUserProfile(state, action) {
      state.user = action.payload
    },
  },
})

export const { userLogin, userLogOut, changeUserProfile } = UserStore.actions
export default UserStore.reducer

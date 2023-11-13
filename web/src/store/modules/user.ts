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
  },
})

export const { userLogin } = UserStore.actions
export default UserStore.reducer

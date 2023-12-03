import { createSlice } from '@reduxjs/toolkit'
import { ThemeMode } from 'antd-style'

interface IUIState {
  roomListLoading: boolean
  currentRoomLoading: boolean
  currentRoomUserListLoading: boolean
  theme: ThemeMode
  value: string[]
}

const initialState = {
  roomListLoading: false,
  currentRoomLoading: false,
  currentRoomUserListLoading: false,
  theme: 'dark',
} as IUIState

export const UIStore = createSlice({
  name: 'uiStore',
  initialState,
  reducers: {
    // 主题
    themeChange(state, action) {
      state.theme = action.payload
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    changeRoomListLoading(state, action) {
      state.roomListLoading = action.payload
    },
    changeCurrentRoomLoading(state, action) {
      state.currentRoomLoading = action.payload
    },
    changeCurrentRoomUserListLoading(state, action) {
      state.currentRoomUserListLoading = action.payload
    },
  },
})

export const { themeChange, changeRoomListLoading, changeCurrentRoomLoading, changeCurrentRoomUserListLoading } = UIStore.actions
export default UIStore.reducer

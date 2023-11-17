import { createSlice } from '@reduxjs/toolkit'
import { ThemeMode } from 'antd-style'

interface IUIState {
  fold: boolean
  theme: ThemeMode
  value: string[]
}

const initialState = {
  fold: true,
  theme: 'dark',
  value: [],
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
  },
})

export const { themeChange } = UIStore.actions
export default UIStore.reducer

import { configureStore } from '@reduxjs/toolkit'
import UIStore from './modules/ui'
import UserStore from './modules/user'

export const store = configureStore({
  reducer: {
    UIStore,
    UserStore,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import thunk from 'redux-thunk'
import ChatRoomReducer from './modules/chatRoom'
import UIReducer from './modules/ui'
import UserReducer from './modules/user'

const persistConfig = {
  key: 'root',
  storage: storageSession,
}

const reducers = combineReducers({
  UIReducer,
  UserReducer,
  ChatRoomReducer,
})

export const persistedReducer = persistReducer(persistConfig, reducers)
export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: [thunk],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import UIReducer from './modules/ui'
import UserReducer from './modules/user'

const persistConfig = {
  key: 'root',
  storage,
}

const reducers = combineReducers({
  UIReducer,
  UserReducer,
})

export const persistedReducer = persistReducer(persistConfig, reducers)
export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: [thunk],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

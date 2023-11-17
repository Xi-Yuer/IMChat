import { AxiosResponse } from 'axios'
import request from '../request'

interface IRegisterParmas {
  account: string
  password: string
  avatar_id?: number
}
export const registerRequest = (params: IRegisterParmas) => {
  return request.post({
    url: '/user/register',
    data: params,
  })
}
export interface ILoginResponse {
  account: string
  nick_name: string
  id: string
  token: string
  profile_picture: string
  gender: number | string
  origin: string
  bio: string
  last_login: string | number
}
export const loginRequest = (params: IRegisterParmas) => {
  return request.post<AxiosResponse<ILoginResponse>>({
    url: '/user/login',
    data: params,
  })
}

interface IUpdateUserParmas {
  nick_name?: string
  gender?: string
  bio?: string
  password?: string
  profile_picture?: string
}
export const updateUserRequest = (params: IUpdateUserParmas) => {
  return request.post<AxiosResponse<ILoginResponse>>({
    url: '/user/update',
    data: params
  })
}


export const logout = () => {
  return request.post({
    url: '/user/logout',
  })
}


export interface IChatRoomResponse {
  name: string
  descripttion: string
  avatar: string
  id: string
  create_at: string
}
export const getUserChatRoom = () => {
  return request.get<AxiosResponse<IChatRoomResponse[]>>({
    url: '/chatroom/list'
  })
}
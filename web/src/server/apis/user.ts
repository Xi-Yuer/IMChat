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
  id: string
  token: string
  profile_picture: string
  gender: number | string
  bio: string
}
export const loginRequest = (params: IRegisterParmas) => {
  return request.post<AxiosResponse<ILoginResponse>>({
    url: '/user/login',
    data: params,
  })
}

interface IUpdateUserParmas {
  account?: string
  gender?: string
  bio?: string
  password?: string
  profile_picture?: string
}
export const updateUserRequest = (params: IUpdateUserParmas) => {
  return request.post({
    url: '/user/update',
    data: params
  })
}

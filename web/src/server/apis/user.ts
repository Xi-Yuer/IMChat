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
}
export const loginRequest = (params: IRegisterParmas) => {
  return request.post<AxiosResponse<ILoginResponse>>({
    url: '/user/login',
    data: params,
  })
}

import request from '../request'

interface IRegisterParmas {
    account: string
    password: string
}
export const registerRequest = (params: IRegisterParmas) => {
    return request.post({
        url: "/user/register",
        data: params
    })
}
export interface ILoginResponse {
    account: string
    id: string
    token: string
    profile_picture: string
}
export const loginRequest = (params: IRegisterParmas) => {
    return request.post<ILoginResponse>({
        url: "/user/login",
        data: params
    })
}
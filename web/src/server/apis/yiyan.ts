import { AxiosResponse } from 'axios'
import request from '../request'

export interface IGetRandomSentence {
  id: string
  hitokoto: string
  cat: string
  catname: string
  author: string
  source: string
  date: string
}
export const getRandomSentence = () => {
  return request.get<AxiosResponse<IGetRandomSentence>>({
    baseURL: 'https://tenapi.cn/v2/yiyan',
    params: {
      format: 'json',
    },
  })
}

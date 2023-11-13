import type {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosInterceptorOptions,
  AxiosResponse,
} from 'axios'

// 扩展拦截器
export interface RequestConfig extends AxiosRequestConfig {
  requestInterceptor?: {
    onFulfilled?: (
      value: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
    onRejected?: ((error: any) => any) | null
    options?: AxiosInterceptorOptions
  }

  responseInterceptor?: {
    onFulfilled?: (value: AxiosResponse) => AxiosResponse
    onRejected?: ((error: any) => any) | null
    options?: AxiosInterceptorOptions
  }
}

export type InterceptorType = Partial<
  Pick<RequestConfig, 'requestInterceptor' | 'responseInterceptor'>
>

export interface IResponse<T = any> {
  data: T
  message: string
  statusCode: number
  timestamp: Date
}

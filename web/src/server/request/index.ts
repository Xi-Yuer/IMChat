import { message } from 'antd'
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type CancelTokenSource,
} from 'axios'
import { store } from '../../store'
import type { InterceptorType, RequestConfig } from './type'

class Request {
  Instance: AxiosInstance | null
  constructor(
    // 实例的请求基础路径
    private readonly baseURL: string,
    // 实例的请求超时时间
    private readonly timeOUT: number,
    // 实例的拦截器
    private readonly interceptor?: InterceptorType,
    // 取消令牌
    private cancelTokenSource: CancelTokenSource | null = null
  ) {
    // 创建一个实例
    this.Instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeOUT,
    })
    // 配置实例的请求拦截
    if (this.interceptor?.requestInterceptor) {
      this.Instance.interceptors.request.use(
        this.interceptor.requestInterceptor.onFulfilled,
        this.interceptor.requestInterceptor.onRejected,
        this.interceptor.requestInterceptor.options
      )
    }
    // 配置实例的响应拦截
    if (this.interceptor?.responseInterceptor) {
      this.Instance.interceptors.response.use(
        this.interceptor.responseInterceptor.onFulfilled,
        this.interceptor.responseInterceptor.onRejected,
        this.interceptor.responseInterceptor.options
      )
    }
  }
  // 实例方法 request
  public request<T = AxiosResponse<any>>(config: RequestConfig): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // 单个接口的请求拦截
      if (config.requestInterceptor) {
        this.Instance?.interceptors.request.use(
          config.requestInterceptor.onFulfilled,
          config.requestInterceptor.onRejected,
          config.requestInterceptor.options
        )
      }
      // 单个接口的响应拦截
      if (config.responseInterceptor) {
        this.Instance?.interceptors.response.use(
          config.responseInterceptor.onFulfilled,
          config.responseInterceptor.onRejected,
          config.responseInterceptor.options
        )
      }

      this.cancelTokenSource = axios.CancelToken.source()
      this.Instance?.request<T>({
        ...config,
        cancelToken: this.cancelTokenSource.token,
      })
        .then((res: any) => {
          if (res.code !== 200) {
            reject(res.data)
          } else {
            resolve(res as any)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 取消请求
  public cancelRequest(): void {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel('取消请求')
    }
  }

  public get<T = any>(config: RequestConfig) {
    return this.request<T>({ method: 'GET', ...config })
  }
  public post<T = any>(config: RequestConfig) {
    return this.request<T>({ method: 'POST', ...config })
  }
  public delete<T = any>(config: RequestConfig) {
    return this.request<T>({ method: 'DELETE', ...config })
  }
  public patch<T = any>(config: RequestConfig) {
    return this.request<T>({ method: 'PATCH', ...config })
  }
  public put<T = any>(config: RequestConfig) {
    return this.request<T>({ method: 'PUT', ...config })
  }
  public head<T = any>(config: RequestConfig) {
    return this.request<T>({ method: 'HEAD', ...config })
  }
  public options<T = any>(config: RequestConfig) {
    return this.request<T>({ method: 'OPTIONS', ...config })
  }
  public trace<T = any>(config: RequestConfig) {
    return this.request<T>({ method: 'TRACE', ...config })
  }
  public connect<T = any>(config: RequestConfig) {
    return this.request<T>({ method: 'CONNECT', ...config })
  }
}

export default new Request('/api', 10000, {
  requestInterceptor: {
    onFulfilled(config) {
      console.log('实例请求成功拦截')
      const token = store.getState().UserReducer?.user?.token
      if (token) {
        config.headers.Authorization = token
      }
      return config
    },
    onRejected(error) {
      console.log('实例请求失败拦截')
      return error
    },
  },
  responseInterceptor: {
    onFulfilled(value) {
      console.log('实例响应成功拦截')
      if (value.data.code === 200) {
        message.success(value.data.msg)
      }
      if (value.data.code !== 200) {
        message.error(value.data.msg)
      }
      return value.data
    },
    onRejected(error) {
      console.log('实例响应失败拦截')
      message.error(error.response.data.msg)
      return error
    },
  },
})

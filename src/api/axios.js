/**
 * 使用案例
 */
// import HttpService from '@/src/api/axios'; // 导入 HttpService
//
// // 创建 HttpService 实例
// const http = new HttpService();
//
// // 发起 GET 请求
// http.get('/api/getData', { param1: 'value1', param2: 'value2' })
//     .then((response) => {
//         // 处理响应数据
//         console.log('GET 请求成功', response);
//     })
//     .catch((error) => {
//         // 处理请求错误
//         console.error('GET 请求失败', error);
//     });
//
// // http POST 请求
// httpService.post('/api/postData', { key1: 'value1', key2: 'value2' })
//     .then((response) => {
//         // 处理响应数据
//         console.log('POST 请求成功', response);
//     })
//     .catch((error) => {
//         // 处理请求错误
//         console.error('POST 请求失败', error);
//     });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { config } from '@/config'

class HttpService {
  /**
   * 构造函数
   */
  constructor() {
    this.http = axios.create({
      baseURL: config.server, // 设置API的基本URL
      timeout: 15000, // 请求超时时间（毫秒）
      headers: {
        'Content-Type': 'application/json', // 设置默认的Content-Type
      },
    })
    this.http.defaults.withCredentials = config.serverUseCookie

    this.useStore = useUserStore()

    // 请求拦截器
    this.http.interceptors.request.use(
      (config) => {
        // 在发送请求之前做些什么，例如添加请求头、处理请求数据等
        config.headers['token'] = this.useStore._jwt
        return config
      },
      (error) => {
        // 处理请求错误
        console.error('请求出错:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.http.interceptors.response.use(
      (response) => {
        // 开发模式, TODO: 如果是开发者账号，也开启
        if (import.meta.env.DEV) {
          console.log(`[${response.config.method.toUpperCase()}][${response.status}]${response.config.url}`, response.data)
        }

        // 对响应数据做些什么，例如处理特定的返回状态码
        // console.log('响应头', response.headers)
        this.useStore.setJwt(response.headers['token'])
        return response.data
      },
      (error) => {
        // 处理响应错误
        console.error('send http request fail:', error)
        return Promise.reject(error)
      }
    )
  }

  /**
   * 发送GET请求
   * @param url 请求地址 /user/login
   * @param params 请求参数
   * @param timeout 请求超时时间, 默认15秒
   * @param retryCount 重试次数, 默认请求失败不重试
   * @param retryDelay 重试请求延时, 默认1秒
   * @param onProgress 请求进度
   * @returns {Promise<unknown>}
   */
  get(url, params = {}, timeout = 15000, retryCount = 0, retryDelay = 1000, onProgress) {
    return new Promise((resolve, reject) => {
      let retry = 0

      const makeRequest = () => {
        this.http
          .get(url, {
            params,
            timeout,
            onDownloadProgress: onProgress ? onProgress : undefined,
          })
          .then((response) => {
            const { status, msg, data } = response.data
            if (status === -1) {
              // TODO: 提示需要登录
              // TODO：路由跳转
              reject(0)
            } else if (status !== 0) {
              // 服务器返回的status不为0，代表处理失败，catch返回status，自己处理弹窗提示
              reject(status)
            } else {
              // 请求成功
              resolve(data)
            }
          })
          .catch((error) => {
            if (retry >= retryCount - 1) {
              // TODO: 弹窗提示请求失败，是否重试
              // console.error(error)
              reject(0)
            } else {
              retry++
              setTimeout(makeRequest, retryDelay)
            }
          })
      }

      makeRequest()
    })
  }

  /**
   * 发送POST请求
   * @param url 请求地址 /user/login
   * @param data 提交数据
   * @param timeout 请求超时时间, 默认15秒
   * @param retryCount 重试次数, 默认请求失败不重试
   * @param retryDelay 重试请求延时, 默认1秒
   * @param onProgress 请求进度
   * @returns {Promise<unknown>}
   */
  post(url, data = {}, timeout = 15000, retryCount = 0, retryDelay = 1000, onProgress) {
    return new Promise((resolve, reject) => {
      let retry = 0

      const makeRequest = () => {
        this.http
          .post(url, data, {
            timeout,
            onUploadProgress: onProgress ? onProgress : undefined,
          })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            if (retry >= retryCount - 1) {
              // TODO: 弹一个通用的细腻狂
              console.error(error)
              reject(error)
            } else {
              retry++
              setTimeout(makeRequest, retryDelay)
            }
          })
      }

      makeRequest()
    })
  }
}

const http = new HttpService()
export default http

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
import { ElMessage, ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import router from '@/router'
import { useAppStore } from '@/stores/app'

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
    this.appStore = useAppStore()
    this.isShowMsgBox = false

    // 请求拦截器
    this.http.interceptors.request.use(
      (config) => {
        // 在发送请求之前做些什么，例如添加请求头、处理请求数据等
        config.headers['token'] = this.useStore._jwt
        config.headers['language'] = this.appStore.language
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
        // console.warn(response)
        const isKeepOnline = response.config.url === '/api/admin/user/keepOnline'
        // 开发模式, TODO: 如果是开发者账号，也开启
        if (import.meta.env.DEV && !isKeepOnline) {
          console.log(
            `[${response.config.method.toUpperCase()}][${response.status}]${response.config.url}`,
            response.data,
            response.config.data
          )
        }
        if (!isKeepOnline) {
          // 对响应数据做些什么，例如处理特定的返回状态码
          // console.log('响应头', response.headers)
          this.useStore.setJwt(response.headers['token'])
        }

        return response.data
      },
      (error) => {
        // 处理响应错误
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
            const { status, msg, data } = response
            const isKeepOnline = url === '/api/admin/user/keepOnline'
            if (status === -1) {
              if (!this.isShowMsgBox && !isKeepOnline) {
                // 提示需要登录
                ElMessageBox.alert(i18n.global.t('app.needLogin'), '', {
                  showClose: false,
                  type: 'warning',
                  confirmButtonText: i18n.global.t('com.btnOk'),
                  callback: () => {
                    this.isShowMsgBox = false
                    // 如果有登录页面, 访问登录页面
                    router.push(config.router.loginPage)
                  },
                })
              }
              this.isShowMsgBox = true
            } else if (status === -2) {
              if (!this.isShowMsgBox && !isKeepOnline) {
                // 提示需要登录
                ElMessageBox.alert(i18n.global.t('app.loginOtherDevice'), '', {
                  showClose: false,
                  type: 'error',
                  confirmButtonText: i18n.global.t('com.btnOk'),
                  callback: () => {
                    this.isShowMsgBox = false
                    // 如果有登录页面, 访问登录页面
                    router.push(config.router.loginPage)
                  },
                })
              }
              this.isShowMsgBox = true
            } else if (status !== 0) {
              // 服务器返回的status不为0，代表处理失败，catch返回status，自己处理弹窗提示
              reject({ status, msg, data })
            } else {
              // 请求成功
              resolve({ data, msg })
            }
          })
          .catch((error) => {
            if (retry >= retryCount - 1) {
              reject({
                status: 99999,
                msg: i18n.global.t('app.requestFail'),
                data: {},
              })
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
            const { status, msg, data } = response
            const isKeepOnline = url === '/api/admin/user/keepOnline'
            if (status === -1) {
              if (!this.isShowMsgBox && !isKeepOnline) {
                // 提示需要登录
                ElMessageBox.alert(i18n.global.t('app.needLogin'), '', {
                  showClose: false,
                  type: 'warning',
                  confirmButtonText: i18n.global.t('com.btnOk'),
                  callback: () => {
                    this.isShowMsgBox = false
                    // 如果有登录页面, 访问登录页面
                    router.push(config.router.loginPage)
                  },
                })
              }
              this.isShowMsgBox = true
            } else if (status === -2) {
              if (!this.isShowMsgBox && !isKeepOnline) {
                // 提示需要登录
                ElMessageBox.alert(i18n.global.t('app.loginOtherDevice'), '', {
                  showClose: false,
                  type: 'error',
                  confirmButtonText: i18n.global.t('com.btnOk'),
                  callback: () => {
                    this.isShowMsgBox = false
                    // 如果有登录页面, 访问登录页面
                    router.push(config.router.loginPage)
                  },
                })
              }
              this.isShowMsgBox = true
            } else if (status !== 0) {
              // 服务器返回的status不为0，代表处理失败，catch返回status，自己处理弹窗提示
              reject({ status, msg, data })
            } else {
              // 请求成功
              resolve({ data, msg })
            }
          })
          .catch((error) => {
            // 网络异常
            if (retry >= retryCount - 1) {
              reject({
                status: 99999,
                msg: i18n.global.t('app.requestFail'),
                data: {},
              })
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
   * 请求成功通用处理
   * @param resolve
   * @param data
   * @param msg
   * @param displayMsg
   */
  requestSuccessCommonHandler(resolve, data, msg, displayMsg = true) {
    if (displayMsg) {
      ElMessage({
        message: msg,
        type: 'success',
      })
    }
    resolve(data)
  }

  /**
   * 请求失败通用处理
   * @param reject
   * @param status
   * @param msg
   * @param data
   * @param tipType
   */
  requestFailCommonHandler(reject, status, msg, data, tipType) {
    // 请求失败
    if (import.meta.env.DEV) {
      console.error('msg', msg)
    }

    if (tipType === 0) {
      ElMessageBox.alert(msg, '', {
        type: 'error',
        showClose: false,
        confirmButtonText: i18n.global.t('com.btnOk'),
      })
    } else {
      ElMessage.error({ message: msg, duration: 8000, showClose: true })
    }

    reject({ status, msg, data })
  }
}

const http = new HttpService()
export default http

import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { config } from '@/config'
import { ElMessage, ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import router from '@/router'
import { useAppStore } from '@/stores/app'

// 创建并配置axios实例
const http = axios.create({
  baseURL: config.server, // 设置API的基本URL
  timeout: 15000, // 请求超时时间（毫秒）
  headers: {
    'Content-Type': 'application/json', // 设置默认的Content-Type
  },
  withCredentials: config.serverUseCookie,
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const useStore = useUserStore()
    const appStore = useAppStore()
    config.headers['token'] = useStore._jwt
    config.headers['language'] = appStore.language
    return config
  },
  (error) => {
    console.error('请求出错:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const useStore = useUserStore()
    const isKeepOnline = response.config.url === '/api/admin/user/keepOnline'
    if ((import.meta.env.DEV || useStore.isDev) && !isKeepOnline) {
      console.log(
        `[${response.config.method.toUpperCase()}][${response.status}]${response.config.url}`,
        response.config.data,
        response.data
      )
    }
    if (!isKeepOnline) {
      useStore.setJwt(response.headers['token'])
    }
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 成功回调函数
const successCb = (url, response, reject, resolve, tipType) => {
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
          // 如果有登录页面, 访问登录页面, 这部分逻辑由router处理
          useUserStore().logout()
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
          // 如果有登录页面, 访问登录页面, 这部分逻辑由router处理
          useUserStore().logout()
        },
      })
    }
    this.isShowMsgBox = true
  } else if (status !== 0) {
    // 服务器返回的status不为0，代表处理失败，catch返回status，自己处理弹窗提示

    if (tipType === 1) {
      ElMessageBox.alert(msg, '', {
        type: 'error',
        showClose: false,
        confirmButtonText: i18n.global.t('com.btnOk'),
      })
    } else if (tipType === 2) {
      ElMessage.error({ message: msg, duration: 8000, showClose: true })
    }

    reject({ status, msg, data })
  } else {
    // 请求成功
    if (tipType === 1 || tipType === 2) {
      ElMessage({
        message: msg,
        type: 'success',
      })
    }

    resolve(data)
  }
}

// 网络错误回调函数
const networkErrorCb = (url, retry, retryCount, reject, makeRequest, retryDelay, error) => {
  if (retry >= retryCount - 1) {
    console.error(error)
    if (url !== '/api/admin/user/keepOnline') {
      ElMessageBox.alert(i18n.global.t('app.requestFail'), '', {
        type: 'error',
        showClose: false,
        confirmButtonText: i18n.global.t('com.btnOk'),
      })

      reject({
        status: 99999,
        msg: i18n.global.t('app.requestFail'),
        data: {},
      })
    }
  } else {
    retry++
    setTimeout(makeRequest, retryDelay)
  }
}

// 导出get方法
const get = (url, params = {}, tipType = 1, timeout = 15000, retryCount = 0, retryDelay = 1000, onProgress) => {
  return new Promise((resolve, reject) => {
    let retry = 0

    const makeRequest = () => {
      http
        .get(url, {
          params,
          timeout,
          onDownloadProgress: onProgress ? onProgress : undefined,
        })
        .then((response) => {
          successCb(url, response, reject, resolve, tipType)
        })
        .catch((error) => {
          networkErrorCb(url, retry, retryCount, reject, makeRequest, retryDelay, error)
        })
    }

    makeRequest()
  })
}

// 导出post方法
const post = (url, data = {}, tipType = 1, timeout = 15000, retryCount = 0, retryDelay = 1000, onProgress) => {
  return new Promise((resolve, reject) => {
    let retry = 0

    const makeRequest = () => {
      http
        .post(url, data, {
          timeout,
          onUploadProgress: onProgress ? onProgress : undefined,
        })
        .then((response) => {
          successCb(url, response, reject, resolve, tipType)
        })
        .catch((error) => {
          networkErrorCb(url, retry, retryCount, reject, makeRequest, retryDelay, error)
        })
    }

    makeRequest()
  })
}

/**
 * 发送GET请求, 请求失败弹无处理
 * @param url 请求地址 /user/login
 * @param data 提交数据
 * @param displayTip 请求成功和失败是否显示提示
 * @param tipType 请求失败时的样式，在displayTip为true时生效。 1对话框形式, 2顶部信息提示
 * @param timeout 请求超时时间, 默认15秒
 * @param retryCount 重试次数, 默认请求失败不重试
 * @param retryDelay 重试请求延时, 默认1秒
 * @param onProgress 请求进度
 * @returns {Promise<unknown>}
 */
export const http_get = (
  url,
  data = {},
  displayTip = true,
  tipType = 1,
  timeout = 15000,
  retryCount = 0,
  retryDelay = 1000,
  onProgress
) => {
  return get(url, data, displayTip ? tipType : 0, timeout, retryCount, retryDelay, onProgress)
}

/**
 * 发送POST请求
 * @param url 请求地址 /user/login
 * @param data 提交数据
 * @param displayTip 请求成功和失败是否显示提示
 * @param tipType 请求失败时的样式，在displayTip为true时生效。 1对话框形式, 2顶部信息提示
 * @param timeout 请求超时时间, 默认15秒
 * @param retryCount 重试次数, 默认请求失败不重试
 * @param retryDelay 重试请求延时, 默认1秒
 * @param onProgress 请求进度
 * @returns {Promise<unknown>}
 */
export const http_post = (
  url,
  data = {},
  displayTip = true,
  tipType = 1,
  timeout = 15000,
  retryCount = 0,
  retryDelay = 1000,
  onProgress
) => {
  return post(url, data, displayTip ? tipType : 0, timeout, retryCount, retryDelay, onProgress)
}

import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { config } from '@/config'
import { ElMessage, ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import { useAppStore } from '@/stores/app'
import { getStatusTipCb, getStatusTipMsg } from '@/axios/axiosHanlder'

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

/** 显示中的对话框 */
const isTipShowing = {
  '/api/admin/user/keepOnline': true, // 屏蔽心跳
}

// 成功回调函数
const successCb = (url, response, reject, resolve, tipType) => {
  const { status, msg, data } = response

  const tip_type = status === 0 ? 'success' : 'error'
  let tip_msg = getStatusTipMsg(status, msg)

  let tip_callback = () => {
    if (status === 0) {
      resolve(data)
    } else {
      reject(response)
    }

    getStatusTipCb(status, data)()
  }

  if (!isTipShowing[url]) {
    if (tipType === 1) {
      isTipShowing[url] = true
      ElMessageBox.alert(tip_msg, '', {
        showClose: false,
        type: tip_type,
        confirmButtonText: i18n.global.t('com.btnOk'),
        callback: () => {
          isTipShowing[url] = false
          tip_callback()
        },
      })
    } else if (tipType === 2) {
      ElMessage({
        message: tip_msg,
        type: tip_type,
      })
      tip_callback()
    } else {
      isTipShowing[url] = false
      tip_callback()
    }
  }
}

// 网络错误回调函数
const networkErrorCb = (url, tipType, retry, retryCount, reject, makeRequest, retryDelay, error) => {
  if (retry >= retryCount - 1) {
    console.error(error)
    if (!isTipShowing[url] && tipType !== 0) {
      isTipShowing[url] = true
      ElMessageBox.alert(i18n.global.t('app.requestFail'), '', {
        type: 'error',
        showClose: false,
        confirmButtonText: i18n.global.t('com.btnOk'),
        callback: () => {
          isTipShowing[url] = false
        },
      })
    }
    reject({
      status: 99999,
      msg: i18n.global.t('app.requestFail'),
      data: {},
    })
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
          networkErrorCb(url, tipType, retry, retryCount, reject, makeRequest, retryDelay, error)
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
          networkErrorCb(url, tipType, retry, retryCount, reject, makeRequest, retryDelay, error)
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

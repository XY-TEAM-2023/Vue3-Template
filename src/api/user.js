import http from './axios'
import { isMobile } from '@/utils'

/**
 * 用户登录
 * @param account 账号
 * @param password 密码
 * @param force 是否强制登录
 * @returns {Promise<unknown>}
 */
export const request_user_login = (account, password, force) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/user/login', { account: account, password: password, force: force, device: isMobile() ? 'mobile' : 'pc' })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        if (status === 106) {
          reject({ status, msg })
        } else {
          http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
        }
      })
  })
}

/**
 * 保持用户在线
 * @returns {Promise<unknown>}
 */
export const request_user_keepLogin = () => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/user/keepOnline', {})
      .then(({ data }) => {
        resolve(data) // 自定义处理
      })
      .catch(({ msg }) => {
        reject(msg)
      })
  })
}

/**
 * 拉取用户列表
 * @param search 模糊搜索账号
 * @param page 第N页
 * @param page_num 煤业显示数量
 * @returns {Promise<unknown>}
 */
export const request_user_list = (initView, search, page, page_num) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/user/list', { search: search, page: page, page_num: page_num })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, !initView) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 注册账号
 * @param account 账号
 * @param password 密码
 * @param role_id 角色ID
 * @param note 备注
 * @returns {Promise<unknown>}
 */
export const request_user_register = (account, password, role_id, note) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/user/register', { account: account, password: password, role_id: role_id, note: note })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 修改用户西南西
 * @param user_id
 * @param password 密码
 * @param role_id 角色ID
 * @param status
 * @param note 备注
 * @returns {Promise<unknown>}
 */
export const request_user_change_info = (user_id, password, role_id, status, note) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/user/updateInfo', { user_id: user_id, password: password, role_id: role_id, status: status, note: note })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 账号封禁
 * @param user_id 账号
 * @param is_lock 密码
 * @returns {Promise<unknown>}
 */
export const request_user_lock = (user_id, is_lock) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/user/lock', { user_id: user_id, is_lock: is_lock })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 清空用户OTP密钥
 * @param user_id 账号
 * @returns {Promise<unknown>}
 */
export const request_user_clear_otp = (user_id) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/user/resetOtp', { user_id: user_id })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 删除账号
 * @param user_id 账号
 * @returns {Promise<unknown>}
 */
export const request_user_delete_account = (user_id) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/user/delete', { user_id: user_id })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

import http from './axios'
import { isMobile } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import i18n from '@/i18n'

export const request_user_login = (account, password, force) => {
  return new Promise((resolve, reject) => {
    http
      .post('/user/login', { username: account, password: password, force: force, device: isMobile() ? 'mobile' : 'pc' })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg) // 请求成功
        // resolve(data) // 自定义处理
        console.log(123)
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

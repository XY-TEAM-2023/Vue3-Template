import http from './axios'
import { isMobile } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import i18n from '@/i18n'

export const request_user_login = (account, password) => {
  return new Promise((resolve, reject) => {
    http
      .post('/user/login', { username: account, password: password, device: isMobile() ? 'mobile' : 'pc' })
      .then((response) => {
        // 服务器返回数据的结构
        const { status, msg, data } = response
        if (status === 0) {
          // 成功
          resolve(data)
        } else {
          // 其他情况, 如果服务器使用服务器返回的msg, 直接提示; 否则根据status设置对应提示
          // 消息提示
          //ElMessage.error({ message: msg, duration: 8000, showClose: true })
          // 对话框形式
          ElMessageBox.alert(msg, '', { type: 'error', showClose: false, confirmButtonText: i18n.global.t('com.btnOk') })
          if (status === 1) reject(status)
        }
      })
      .catch((error) => {
        // 处理请求错误
        console.error('POST 请求失败', error)
      })
  })
}

import i18n from '@/i18n'
import { useUserStore } from '@/stores/user'

/**
 * 需要指定提示内容的装他妈
 * @param status 状态码
 * @param msg 原始提示消息
 */
export function getStatusTipMsg(status, msg) {
  if(status === -1){
    return i18n.global.t('app.sessionTimeout')
  }
  if (status === -2) {
    return i18n.global.t('app.loginOtherDevice')
  }
  return msg
}

/**
 * 需要特殊处理的状态码
 * @param status 状态码
 */
export function tryInvokeStatusTipCb(status, data) {
  return () => {
    if (status === -1) {
      // 需要登录
      useUserStore().logout()
      return true
    } else if (status === -2) {
      // 账号在其他设备上登录
      useUserStore().logout()
      return true
    } else if (status === -3) {
      // 身份认证失效
      useUserStore().logout()
      return true
    }
    return false
  }
}

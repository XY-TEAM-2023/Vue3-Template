import { config } from '@/config'

class timeUtil {
  // 构造函数，可以在这里设置一些默认值或配置
  constructor() {}

  /**
   * 将本地时间转换为UTC时间文本
   * @param localTs 本地时间戳
   * @returns {string}
   */
  localToUtcText(localTs) {
    const localDate = new Date(localTs)
    const utcDate = new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        localDate.getHours(),
        localDate.getMinutes(),
        localDate.getSeconds()
      )
    )
    return this.formatDate(utcDate) // 使用自定义格式化函数
  }

  /**
   * 将UTC时间转换为目标时区时间文本
   * @param utcDate
   * @returns {string}
   */
  utcToTimezoneText(utcDate) {
    const targetTime = new Date(utcDate.getTime() + config.timezone * 60 * 60000)
    return this.formatDate(targetTime) // 重用自定义格式化函数
  }

  /**
   * 将本地时间直接转换为目标时区时间文本
   * @param localDate
   * @returns {string}
   */
  localToTimezoneText(localDate) {
    const utcDate = this.localToUtcText(localDate) // 这里使用类内的方法
    return this.utcToTimezoneText(utcDate) // 这里使用类内的方法
  }

  /**
   * 辅助函数：格式化日期时间为 "年/月/日 时:分:秒" 的格式
   * @param date
   * @returns {string}
   */
  formatDate(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
  }
}

export default timeUtil

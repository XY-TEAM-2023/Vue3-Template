import { config } from '@/config'

/**
 * 时间戳到指定时区
 * @param timestamp
 * @returns {Date}
 */
export function timestampToTimezoneDate(timestamp) {
  if (!timestamp && timestamp === 0) {
    return undefined
  }

  // 创建一个基于UTC时间的Date对象
  const date = new Date(timestamp)

  // 计算目标时区相对于UTC的毫秒偏移量
  const offsetInMilliseconds = config.timezone * 60 * 60 * 1000

  // 计算新的时间戳，代表目标时区的时间
  const newTimestamp = date.getTime() + offsetInMilliseconds

  // 创建并返回一个新的Date对象，其时间等于目标时区的时间
  return new Date(newTimestamp)
}

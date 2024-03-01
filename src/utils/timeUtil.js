import { config } from '@/config'

/**
 * 时间戳到指定时区的Date
 * @param timestamp
 * @returns {Date}
 */
export function tsToTimezoneDate(timestamp) {
  if (!timestamp || timestamp === 0) {
    return undefined
  }

  if ((timestamp + '').length === 10) {
    timestamp = timestamp * 1000
  }

  // 创建一个基于UTC时间的Date对象
  const date = new Date(timestamp)

  // 设置目标时区的小时偏移量
  const offsetHours = config.timezone

  // 获取本地时间和UTC时间之间的毫秒偏移量
  const localOffsetInMilliseconds = date.getTimezoneOffset() * 60 * 1000

  // 计算新的时间戳，代表目标时区的时间
  const newTimestamp = date.getTime() + localOffsetInMilliseconds + offsetHours * 60 * 60 * 1000

  // 创建并返回一个新的Date对象，其时间等于目标时区的时间
  return new Date(newTimestamp)
}

/**
 * 时间戳到指定时区的时间文本
 * @param timestamp 时间戳
 * @returns {String}
 */
export function tsToTime(timestamp) {
  const date = tsToTimezoneDate(timestamp)
  if (date === undefined) {
    return '-----'
  }
  try {
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  } catch (error) {
    return '-----'
  }
}

/**
 * 判断是否是移动设备
 * @returns {boolean}
 */
export default function isMobile() {
  const userAgent = navigator.userAgent
  // 使用正则表达式匹配常见的移动设备关键词
  const mobileKeywords = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobilePlatform = mobileKeywords.test(userAgent)
  if (isMobilePlatform) {
    // 屏幕宽度小于500px使用手机显示
    return window.innerWidth < 500
  }
  return false // PC端
}

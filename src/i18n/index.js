import { createI18n } from 'vue-i18n'
import EN from './en'
import ZH from './zh'
import KO from './ko'
import { useAppStore } from '@/stores/app'
import { config } from '@/config'

// 语言配置
const messages = {
  en: { ...EN },
  zh: { ...ZH },
  ko: { ...KO },
}

// 从本地数据中读取当前语言
function getLanguageFromLocalStorage() {
  const localStorageData = localStorage.getItem('app') // 获取本地持久化数据
  if (localStorageData) {
    try {
      const parsedData = JSON.parse(localStorageData)
      const language = parsedData.language
      if (language && language.trim() !== '') {
        return language
      }
    } catch (error) {
      return config.defaultLanguage
    }
  }
  // 默认返回 'en' 作为容错机制
  return config.defaultLanguage
}

const i18n = createI18n({
  locale: getLanguageFromLocalStorage(), // 设置当前语言类型
  // fallbackLocale: 'en', // 如果当前语言没有相应翻译时使用的后备语言
  messages,
})

i18n.global.init = () => {
  const appStore = useAppStore()

  appStore.initLanguage(messages, (lang) => {
    if (messages[lang]) {
      i18n.global.locale = lang // 切换语言
      return true // 返回 true 表示切换成功并有相关配置
    } else {
      return false // 返回 false 表示切换失败或没有相关配置
    }
  })
}

export default i18n

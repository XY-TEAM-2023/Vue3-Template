// 网站配置
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    /**默认语言 */
    language: 'zh',
    /**国际化列表 */
    languages: [],
    /**内部-切换语言处理器*/
    _languageSwitchHandler: null,
  }),

  getters: {},

  /*****************************************
   * 自定义函数
   *****************************************/
  actions: {
    /**
     * 更新支持的国际化语言列表
     * @param configs
     * @param languageSwitchHandler 切换语言的处理逻辑
     */
    initLanguage(configs, languageSwitchHandler) {
      this._languageSwitchHandler = languageSwitchHandler
      this.languages.splice(0, this.languages.length)
      for (const k in configs) {
        this.languages.push(k)
      }

      this.setLanguage(this.language.value)
    },
    /**
     * 设置语言
     */
    setLanguage(lang) {
      if (lang && lang.value) lang = lang.value
      if (!this._languageSwitchHandler) return false
      if (!this._languageSwitchHandler(lang)) return false
      this.language = lang
      return true
    },
  },

  /*****************************************
   * 持久化数据配置
   *****************************************/
  persist: {
    key: 'app', // 区分不同store
    enabled: true,
    strategies: [{ storage: localStorage }],
  },
})

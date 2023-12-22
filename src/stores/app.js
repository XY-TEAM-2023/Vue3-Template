// 网站配置
import { defineStore } from 'pinia'
import { config } from '@/config'

export const useAppStore = defineStore('app', {
  state: () => ({
    /** Logo组件显示文本 */
    logoLabel: config.logo.label,
    /**默认语言 */
    language: config.language,
    /**国际化列表 */
    languages: [],
    /**内部-切换语言处理器*/
    _languageSwitchHandler: null,
    /**路由菜单-当前访问的路径 */
    routerPath: '',
    /**路由菜单-显示小红点的路由*/
    _routerRedDot: {},
    /** 导航栏菜单是否折叠 */
    menuIsCollapse: false,
    /** 是否启用暗黑模式 */
    themeDarkMode: false,
    /** 当前打开过的Tabs */
    openedTabs: [],
    /** 每页显示的数据*/
    pageSizes: [3, 20, 50, 100],
    /** 搜索数据列表时，每页返回的数据 */
    pageNum_userList: -1,
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
    /**
     * 设置路由小红点
     * @param path 路由路径
     * @param content 显示内容，如果内容为空，显示单纯的小红点
     * @param clickHide 点击后隐藏，默认微针
     */
    setRouteRedDot(path, content = '', clickHide = true) {
      this._routerRedDot[path] = {
        display: true,
        content: content,
        clickHide: clickHide,
        looked: false,
      }
    },
    /**
     * 取路由是否显示小红点
     * @param path 路由路径
     * @returns {boolean}
     */
    isShowRouteRedDot(path) {
      const route = this._routerRedDot[path]
      return route && route.display
    },
    /**
     * 取油路显示内容
     * @param path
     * @returns {String} 返回内容, 如果为空显示小红点
     */
    getRouteRedDotValue(path) {
      const route = this._routerRedDot[path]
      return route && route.content
    },
    /**
     * 取路由是否已经查看过小红点
     * @param path 路径
     * @returns {boolean}
     */
    getRouteRedDotIsLooked(path) {
      const route = this._routerRedDot[path]
      return route && route.looked
    },
    /**
     * 尝试隐藏小红点
     * @param path 路由路径
     */
    tryHideRouteRedDot(path) {
      const route = this._routerRedDot[path]
      if (!route) {
        return
      }
      if (route.clickHide) {
        this._routerRedDot[path].display = false
      }
      this._routerRedDot[path].looked = true
    },
  },

  /*****************************************
   * 持久化数据配置
   *****************************************/
  persist: {
    key: 'app', // 区分不同store
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['language', 'routerPath', 'themeDarkMode', 'openedTabs', 'pageNum_userList'] }],
  },
})

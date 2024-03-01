// 于管理用户的相关数据
import { defineStore } from 'pinia'
import { useAppStore } from '@/stores/app'
import { config } from '@/config'
import router from '@/router'
import { http_post } from '@/axios'
import { asyncRoutes } from '@/router/asyncRoutes'

let keepAliveTimerId = null

async function tryRunKeepAliveTimer() {
  if (keepAliveTimerId) {
    return
  }

  // 启动保持在线的定时器
  keepAliveTimerId = setInterval(async () => {
    // 保持用户在线
    await http_post('/api/admin/user/keepOnline', {}, false)
      .then(() => {})
      .catch(() => {})
  }, 20000) // 每20秒发送一次请求
}

// 定义一个名为 "user" 的 store(数据管理对象)
export const useUserStore = defineStore('user', {
  /*****************************************
   * 定义当前对象会保存哪些基础数据
   *****************************************/
  state: () => ({
    /**用户id */
    userId: 0,
    /**用户账号 */
    account: 'coco',
    /**角色名，比如: 普通用户、测试用户、管理员账号 */
    role_name: '',
    /**角色ID */
    role_id: -1,
    /**
     * jwt字符串
     * "_"代表这是个不希望外界调用的属性
     */
    _jwt: '',
    /** 路由基础配置 */
    routes: [],
    /** 页面权限 */
    permission: {},
    /** 首页 */
    homePage: '',
  }),

  /*****************************************
   * 取值：对 state 里的数据加工后返回
   *****************************************/
  getters: {
    /**
     * jwt的数据
     * @returns {Object}
     */
    jwtData() {
      if (!this._jwt) {
        return {}
      }

      // 解析JWT中间payload数据
      const tokenParts = this._jwt.split('.')
      if (tokenParts.length !== 3) {
        return {}
      }
      // 尝试将数据转成json对象
      let payload = null
      try {
        payload = JSON.parse(atob(tokenParts[1]))
      } catch (error) {
        return {}
      }

      // jwt已经失效
      if (!payload.exp || Math.floor(Date.now() / 1000) > payload.exp) {
        return {}
      }

      return payload['data']
    },

    /**
     * 是否为开发账号
     */
    isDev() {
      const jwt_data = this.jwtData
      if (!jwt_data) {
        return false
      }
      return jwt_data.roleId === 0
    },
  },

  /*****************************************
   * 自定义函数
   *****************************************/
  actions: {
    /**
     * 登录成功，设置登录后信息
     */
    loginSuccess(account, response) {
      this.account = account
      const jwt_data = this.jwtData
      this.role_id = jwt_data.roleId
      this.userId = jwt_data.userId
      this.role_name = response.roleName
      this.permission = response.permission
      const isServerAsyncRoutes = config.isServerAsyncRoutes

      let tempHomePage = null
      const organizeDataCb = (data) => {
        if (Array.isArray(data)) {
          // 子菜单构造
          const result = []
          data.forEach((item) => {
            result.push(organizeDataCb(item))
          })
          return result
        } else if (data !== null && typeof data === 'object') {
          if (!isServerAsyncRoutes) {
            data.meta = data.meta !== undefined ? data.meta : {}
            data.meta.title = data.meta.title !== undefined ? data.meta.title : {}
            data.meta.public = data.meta.public !== undefined ? data.meta.public : {}
          }

          // console.log(data)
          let menu = {
            path: data.path !== undefined && data.path !== null && data.path !== '' ? data.path : data.name,
            name: data.name,
            component: isServerAsyncRoutes ? data.component.replace('{platform}', '${platform}') : data.component,
            redirect: data.redirect,
            meta: {
              icon: isServerAsyncRoutes ? data.icon : data.meta.icon,
              hidden: isServerAsyncRoutes ? false : data.meta.hidden,
              needLogin: isServerAsyncRoutes ? true : data.meta.needLogin === undefined || data.meta.needLogin,
              title: {
                en: isServerAsyncRoutes ? data.title_en : data.meta.title.en,
                zh: isServerAsyncRoutes ? data.title_zh : data.meta.title.zh,
                ko: isServerAsyncRoutes ? data.title_ko : data.meta.title.ko,
              },
              cache: isServerAsyncRoutes ? data.meta.cache === 1 : data.meta.cache,
              permission: isServerAsyncRoutes ? data.permission : data.meta.permission,
              public: {
                desktop: isServerAsyncRoutes ? data.enable_desktop : data.meta.public.desktop,
                mobile: isServerAsyncRoutes ? data.enable_mobile : data.meta.public.mobile,
              },
            },
          }
          // console.log(menu)

          // 有子菜单
          const tempChildren = organizeDataCb(data.children)
          if (tempChildren) {
            menu.children = tempChildren
            // 删除目录原始的component
            delete menu.component

            // 当访问目录的时候, 默认的跳转地址
            if (tempChildren.length > 0) {
              menu.redirect = { name: tempChildren[0].name }
            }
          } else {
            if (!tempHomePage) {
              tempHomePage = data.name
            }
          }

          return menu
        }
        return null
      }
      if (isServerAsyncRoutes) {
        this.routes = organizeDataCb(response.routes)
        this.homePage = response.homePage ? response.homePage : tempHomePage
      } else {
        this.routes = organizeDataCb(asyncRoutes)
        this.homePage = config.router.homePage
      }

      // console.error(this.homePage)

      // 重新加载路由配置
      router.reloadRoutes(true)

      tryRunKeepAliveTimer()
    },
    /**
     * 注销登录
     */
    logout(sendReqeust = false) {
      const clearDataCb = () => {
        this._jwt = ''
        this.userId = 0
        this.role_name = ''
        this.role_id = -1
        this.routes = []
        useAppStore().openedTabs.splice(0)

        // 停止保持在线的定时器
        if (keepAliveTimerId) {
          clearInterval(keepAliveTimerId)
          keepAliveTimerId = null
        }

        router.push('/')
      }

      if (sendReqeust) {
        http_post('/api/admin/user/logout', {}, false)
          .then(() => {})
          .catch(() => {})
          .finally(() => {
            clearDataCb()
          })
      } else {
        clearDataCb()
      }
    },

    /**
     * 更新JWT
     */
    setJwt(jwt) {
      this._jwt = jwt
    },
    /**
     * 登录状态
     * @returns {number} -1未登录；0已登录；1登录失效；
     */
    getLoginStatus() {
      // 未登录
      if (!this._jwt || this.userId <= 0) {
        return -1
      }

      // 解析JWT中间payload数据
      const tokenParts = this._jwt.split('.')
      if (tokenParts.length !== 3) {
        console.error('JWT token is not in the correct format.')
        return 1 // 错误的jwt，视为登录失效
      }
      // 尝试将数据转成json对象
      let payload = null
      try {
        payload = JSON.parse(atob(tokenParts[1]))
      } catch (error) {
        console.error('Error parsing JWT payload.')
        return 1 // 错误的jwt，视为登录失效
      }

      // 检查是否存在exp声明, 如果为声明视为登录失效
      if (!payload.exp) {
        return 1
      }

      // jwt已经失效，登录失效
      if (Math.floor(Date.now() / 1000) > payload.exp) {
        return 1
      }

      tryRunKeepAliveTimer()
      // 已登录
      return 0
    },
  },

  /*****************************************
   * 持久化数据配置
   *****************************************/
  persist: {
    key: 'user', // 区分不同store
    enabled: true,
    strategies: [{ storage: localStorage }],
  },
})

// 于管理用户的相关数据
import { defineStore } from 'pinia'
import { useAppStore } from '@/stores/app'

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
    /**用户角色名，比如: 普通用户、测试用户、管理员账号 */
    role: '',
    /**
     * jwt字符串
     * "_"代表这是个不希望外界调用的属性
     */
    _jwt: '',
  }),

  /*****************************************
   * 取值：对 state 里的数据加工后返回
   *****************************************/
  getters: {
    /**
     * 是否为测试账号
     * @returns {boolean}
     */
    isTestAccount() {
      return this.roles.includes('test')
    },

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
     * 登录状态
     * @returns {number} -1未登录；0已登录；1登录失效；
     */
    loginStatus() {
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

      // 已登录
      return 0
    },
  },

  /*****************************************
   * 自定义函数
   *****************************************/
  actions: {
    /**
     * 注销登录
     */
    logout() {
      this.userId = 0
      this.role = ''
      this._jwt = ''
      useAppStore().openedTabs.splice(0)
    },

    /**
     * 更新JWT
     */
    setJwt(jwt) {
      this._jwt = jwt
    },

    /**
     * 登录成功，设置登录后信息
     */
    loginSuccess(account, role) {
      const jwt_data = this.jwtData
      this.userId = jwt_data.userId
      this.account = account
      this.role = role
      // this.roles = jwt_data.roles
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

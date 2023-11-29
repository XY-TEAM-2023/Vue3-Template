// user.js 用于管理用户的相关数据
// 引入pinia插件
import { defineStore } from 'pinia'

// 定义一个名为 "user" 的 store(数据管理对象)
export const useUserStore = defineStore({
  /**store 的唯一标识 */
  id: 'user',

  /*****************************************
   * 定义当前对象会保存哪些基础数据，可直接读取
   * 在Vue中可以直接只能进行取值操作，不可修改
   *****************************************/
  state: () => ({
    /**用户id */
    userId: 0,
    /**用户账号 */
    account: '',
    /**用户角色，0普通用户；1测试用户；2管理员账号 */
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
     * @param {*} state 固定参数，实际操作中代表上面定义的state
     * @returns {boolean}
     */
    isTestAccount: (state) => {
      return state.role == 1 // 假设 role 为1的时，该用户为测试账号
    },

    /**
     * 是否为开发账号
     * @param {*} state
     * @returns {boolean}
     */
    isDevAccount: (state) => {
      return state.role == 2
    },

    /**
     * 登录状态
     * @param {*} state
     * @returns {number} -1未登录；0已登录；1登录失效；
     */
    loginStatus: (state) => {
      // 未登录
      if (!state._jwt || state.userId <= 0) {
        return -1
      }

      // 解析JWT中间payload数据
      const tokenParts = jwtToken.split('.')
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
   * 修改数据
   *****************************************/
  actions: {
    /**
     * 注销登录
     */
    logout() {
      this.userId = 0
      this.account = ''
      this.role = ''
      this._jwt = ''
    },

    /**
     * 更新JWT
     */
    setJwt(jwt) {
      this._jwt = jwt
    },

    /**
     * 设置登录后的信息
     * @param {*} id 用户唯一ID
     * @param {*} account 用户账号
     * @param {*} role 用户角色。0普通用户；1测试用户；2管理员账号
     */
    setLoginData(id, account, role) {
      this.userId = id
      this.account = account
      this.role = role
    },
  },

  /*****************************************
   * 持久化数据配置
   *****************************************/
  persist: {
    // 开启后，默认会对整个 Store 的 state 内容进行 sessionStorage 储存
    enabled: true,
    strategies: [
      {
        // 持久化数据位置：localStorage 或 sessionStorage
        storage: localStorage,
        // 指定state中需要持久化的字段，不配置paths时将对所有内容进行持久化
        // paths: ['foo', 'bar'],
      },
    ],
  },
})

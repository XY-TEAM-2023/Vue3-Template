// 网站配置
import { defineStore } from 'pinia'
import { http_post } from '@/axios'

export const useDemandStore = defineStore('demand', {
  state: () => ({
    fields: [],
    /** 页面索引模块tree结构 */
    modulesTree: [],
  }),

  getters: {},

  /*****************************************
   * 自定义函数
   *****************************************/
  actions: {
    /** 刷新fields数据 */
    refreshFields() {
      return new Promise((resolve, reject) => {
        http_post('/api/admin/demand/field/list', {}, false)
          .then((response) => {
            this.fields = response.result
            resolve()
          })
          .then((err) => {
            reject(err)
          })
      })
    },
    /** 根据id取字段信息 */
    getFieldInfoById(field_id) {
      for (let i = 0; i < this.fields.length; i++) {
        if (this.fields[i].id + '' === field_id + '') {
          return this.fields[i]
        }
      }
      return {}
    },
    /** 刷新模块列表 */
    refreshModules() {
      return new Promise((resolve, reject) => {
        http_post('/api/admin/demand/page/plan/module/tree', {}, false)
          .then((r) => {
            this.modulesTree = r.config
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    /** 寻找模块是否别其他模块引用 */
    findModuleIsUsed(module_id){

    }
  },

  /*****************************************
   * 持久化数据配置
   *****************************************/
  persist: {},
})

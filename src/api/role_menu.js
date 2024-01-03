import http from './axios'

/**
 * 拉取角色菜单配置
 * @returns {Promise<unknown>}
 */
export const request_role_menu_list = (role_id) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/menu/list', { role_id: role_id })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, false) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 修改角色菜单配置
 * @returns {Promise<unknown>}
 */
export const request_role_menu_edit = (role_id, config) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/menu/edit', { role_id: role_id, config: config })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, false) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

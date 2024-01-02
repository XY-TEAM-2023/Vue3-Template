import http from './axios'

/**
 * 拉取角色树形结构
 * @returns {Promise<unknown>}
 */
export const request_role_tree = (initView) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/tree', {})
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, !initView) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 拉取子角色列表
 * @returns {Promise<unknown>}
 */
export const request_role_list = (initView, onlySelf) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/list', { type: onlySelf ? 2 : 1 })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, !initView) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 创建角色
 * @returns {Promise<unknown>}
 */
export const request_role_create = (parent_id, name, note) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/create', { parent: parent_id, name: name, note: note })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, true) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 编辑角色信息
 * @returns {Promise<unknown>}
 */
export const request_role_edit = (id, note) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/edit', { role_id: id, note: note })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, true) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 封禁角色
 * @returns {Promise<unknown>}
 */
export const request_role_lock = (id) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/lock', { role_id: id })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, true) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 解禁角色
 * @returns {Promise<unknown>}
 */
export const request_role_unlock = (id, include_children) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/unlock', { role_id: id, include_children: include_children })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, true) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

/**
 * 删除角色
 * @returns {Promise<unknown>}
 */
export const request_role_delete = (id) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/delete', { role_id: id })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, true) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

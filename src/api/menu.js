import http from './axios'

/**
 * 初始化路由基础配置
 * @returns {Promise<unknown>}
 */
export const request_menu_update = (router_list, default_config) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/menu/update', { list: router_list, default_config: default_config })
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
 * 拉取路由基础配置
 * @returns {Promise<unknown>}
 */
export const request_menu_list = () => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/menu/list', {})
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
 * 修改路由基础配置-标题
 * @returns {Promise<unknown>}
 */
export const request_menu_edit_title = (id, title, local) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/menu/edit/title', { id: id, title: title, local: local })
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
 * 修改路由基础配置-图标
 * @returns {Promise<unknown>}
 */
export const request_menu_edit_icon = (id, icon) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/menu/edit/icon', { id: id, icon: icon })
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
 * 修改路由基础配置-组件路径
 * @returns {Promise<unknown>}
 */
export const request_menu_edit_component = (id, component) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/menu/edit/component', { id: id, component: component })
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
 * 修改路由基础配置-标题
 * @returns {Promise<unknown>}
 */
export const request_menu_edit_display = (id, display) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/menu/edit/display', { id: id, display: display })
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
 * 修改路由基础配置-缓存
 * @returns {Promise<unknown>}
 */
export const request_menu_edit_cache = (id, cache) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/menu/edit/cache', { id: id, cache: cache })
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
 * 修改路由基础配置-缓存
 * @returns {Promise<unknown>}
 */
export const request_menu_edit_delete = (id) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/menu/edit/delete', { id: id })
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
 * 修改路由基础配置-设置为首页
 * @returns {Promise<unknown>}
 */
export const request_menu_set_home = (id) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/menu/edit/main', { id: id })
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
 * 修改路由基础配置-设置为首页
 * @returns {Promise<unknown>}
 */
export const request_menu_permission_update = (views) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/menu/permission/update', { views: views })
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
 * 拉取组件权限配置
 * @returns {Promise<unknown>}
 */
export const request_menu_permission_get = (name) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/menu/permission/get', { name: name })
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
 * 设置主页
 * @returns {Promise<unknown>}
 */
export const request_menu_permission_set_home = (role_id, menu_name) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/menu/setHome', { role_id: role_id, menu_name: menu_name })
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
 * 修改角色某个页面的权限
 * @returns {Promise<unknown>}
 */
export const request_role_menu_permission_update = (role_id, menu_name, permission) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/menu/updatePermission', { role_id: role_id, menu_name: menu_name, permission: permission })
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
 * 设置主页
 * @returns {Promise<unknown>}
 */
export const request_role_menu_set_home = (role_id, menu_name) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/menu/setHome', { role_id: role_id, menu_name: menu_name })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, true) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

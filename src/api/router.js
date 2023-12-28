import http from './axios'

/**
 * 初始化路由基础配置
 * @returns {Promise<unknown>}
 */
export const request_router_init = (router_list, isClick) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/router/base/init', { list: router_list })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, isClick) // 请求成功
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
export const request_router_base = (isClick) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/router/base/list', {})
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, isClick) // 请求成功
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
export const request_router_edit_title = (id, title, local) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/router/base/edit/title', { id: id, title: title, local: local })
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
export const request_router_edit_component = (id, component) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/router/base/edit/component', { id: id, component: component })
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
export const request_router_edit_display = (id, display) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/router/base/edit/display', { id: id, display: display })
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
export const request_router_edit_cache = (id, cache) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/router/base/edit/cache', { id: id, cache: cache })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg, true) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

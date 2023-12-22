import http from './axios'

/**
 * 拉取角色列表
 * @param page 第N页
 * @param page_num 煤业显示数量
 * @returns {Promise<unknown>}
 */
export const request_role_next_list = (parent_id, page, page_num) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/admin/role/nex_list', { parent: parent_id, page: page, page_num: page_num })
      .then(({ data, msg }) => {
        http.requestSuccessCommonHandler(resolve, data, msg) // 请求成功
        // resolve(data) // 自定义处理
      })
      .catch(({ status, msg, data }) => {
        http.requestFailCommonHandler(reject, status, msg, data, 0) // 请求失败
      })
  })
}

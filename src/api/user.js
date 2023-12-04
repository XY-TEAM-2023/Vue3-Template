import http from './axios' // 导入 HttpService

export const request_user_login = (account, password) => {
  return new Promise((resolve, reject) => {
    http
      .post('/api/user/login', { account: account, password: password })
      .then((response) => {
        const { status, msg, data } = response
        switch (response.status) {
          case 0:
            // 请求成功
            resolve(response.data)
            break
          case 1:
            // 返回其他状态
            reject('param account is error')
            break
        }
        // 处理响应数据
        console.log('POST 请求成功', response)
      })
      .catch((error) => {
        // 处理请求错误
        console.error('POST 请求失败', error)
      })
  })
}

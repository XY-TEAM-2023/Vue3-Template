<!-- Login.vue -->
<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">Login</button>
    </form>

    <br />

    <div>
      <p>登录后信息</p>
      <p>登录后信息</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    login() {
      // 在这里执行登录逻辑，可以发送登录请求到服务器
      // 如果登录成功，导航到另一个页面，否则显示错误消息
      if (this.username === '123' && this.password === '123') {
        // 模拟登录成功
        alert('模拟登录成功')
      } else {
        alert('登录失败，请检查用户名和密码')
      }
    },
  },
}
</script>

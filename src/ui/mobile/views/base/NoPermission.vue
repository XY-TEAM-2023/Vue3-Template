<template>
  <div class="no-access-page flex-center">
    <div class="no-access-content">
      <h1>无权限访问</h1>
      <p>抱歉，您没有权限访问该页面。</p>
      <router-link to="/">返回首页</router-link>
    </div>
  </div>
</template>

<style scoped>
.no-access-page {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

.no-access-content {
  text-align: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}

router-link {
  text-decoration: none;
  color: #007aff;
  font-weight: bold;
}
</style>

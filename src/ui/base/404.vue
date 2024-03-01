<template>
  <div class="error-container">
    <div class="error-code">404</div>
    <div class="message">Oops! Page not found.</div>
    <div class="description">We can't find the page you're looking for.</div>
    <router-link to="/" class="home-button">Go Home</router-link>
  </div>
</template>

<script setup>
// Vue 3 <script setup> 是一种更简洁的组件声明方式
</script>

<style scoped>
.error-container {
  text-align: center;
  padding: 50px;
  margin-top: 100px;
}

.error-code {
  font-size: 72px;
  font-weight: bold;
  color: #333;
}

.message {
  font-size: 24px;
  color: #333;
  margin: 20px 0;
}

.description {
  font-size: 16px;
  color: #666;
}

.home-button {
  display: inline-block;
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.home-button:hover {
  background-color: #0056b3;
}
</style>

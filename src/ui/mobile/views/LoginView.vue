<template>
  <div class="login-body">
    <div class="login-box">
      <h2>{{ config.logo.label }}</h2>
      <el-input :placeholder="$t('loginView.inputAccount')" v-model="account" show-password></el-input>
      <div style="height: 20px" />
      <el-input :placeholder="$t('loginView.inputPassword')" v-model="password" show-password></el-input>
      <div style="height: 20px" />
      <div class="login-box-btnArea">
        <ui-i18n class="login-i18n" color="#ffffff" />
        <el-button type="primary" :loading="isRequesting" @click="onLogin">{{ $t('loginView.loginBtn') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { config } from '@/config'
import UiI18n from '@/ui/desktop/components/UiI18n.vue'
import { request_user_login } from '@/api/user'

const account = ref('')
const password = ref('')

onMounted(() => {
  console.log('组件已挂载')
})

/** 是否正在登录中 */
const isRequesting = ref(false)

/** 登录按钮事件 */
function onLogin() {
  isRequesting.value = true
  request_user_login(account.value, password.value).finally(() => {
    isRequesting.value = false
  })
}

onBeforeUnmount(() => {
  console.log('组件销毁之前')
})
</script>

<style scoped lang="scss">
.login-body {
  height: 100%;
  font-family: sans-serif;
  background: linear-gradient(#141e30, #243b55);
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
}

.login-box h2 {
  margin: 0 0 20px;
  padding: 0;
  color: #fff;
}

.login-box-btnArea {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

  .el-button {
    margin-left: auto;
  }
}
</style>

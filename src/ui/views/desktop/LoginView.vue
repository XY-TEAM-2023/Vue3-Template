<template>
  <div class="login-body unselect">
    <div class="login-box">
      <h2>{{ config.logo.label }}</h2>
      <el-form style="width: 100%">
        <el-input :placeholder="$t('loginView.inputAccount')" v-model="account" show-password></el-input>
        <div style="height: 20px" />
        <el-input :placeholder="$t('loginView.inputPassword')" v-model="password" show-password></el-input>
        <div style="height: 20px" />
        <div class="login-box-btnArea">
          <ui-i18n class="login-i18n" color="#ffffff" />
          <el-button v-menu="menuItems" type="primary" :loading="isRequesting" @click="onLogin">
            {{ $t('loginView.loginBtn') }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { config } from '@/config'
import UiI18n from '@/ui/components/UiI18n.vue'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import { http_post } from '@/utils/axios'
import { isMobile } from '@/utils'

const userStore = useUserStore()

// const account = ref('coco')
const account = ref('admin')
const password = ref('123456')
// const account = ref(userStore.account)
// const password = ref('')

const menuItems = [
  { text: '选项1', icon: 'Finished', hoverColor: '#FF0000', action: () => console.log('选项1被点击') },
  {
    text: '选项2',
    icon: `<svg t="1703992207510" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2478" width="32" height="32"><path d="M347.64 546.3l103.28 357.77 498.07-720zM334.72 523.93l614.27-339.86-872.55 71.61z" fill="#040000" p-id="2479"></path></svg>`,
    action: () => console.log('选项2被点击'),
  },
  // 其他菜单项
]
/** 是否正在登录中 */
const isRequesting = ref(false)

const route = useRoute()
onMounted(() => {
  // 提取需要跳转回去的路由
  // const redirectTo = route.query.redirect || config.router.homePage
  // console.log(redirectTo)
})

/** 登录按钮事件 */
function onLogin(isForce = false) {
  isRequesting.value = true
  // 用户登录
  http_post(
    '/api/admin/user/login',
    { account: account.value, password: password.value, force: isForce, device: isMobile() ? 'mobile' : 'pc' },
    false
  )
    .then((data) => {
      console.log(data)
      // 刷新用户全局数据，记录登录状态
      userStore.loginSuccess(account.value, data)
      // 跳转页面
      router.push({ name: userStore.homePage })
    })
    .catch(({ status, msg }) => {
      console.log(msg)
      // 已经有人登录过了
      if (status === 106) {
        ElMessageBox.confirm(msg, '', {
          confirmButtonText: i18n.global.t('com.btnOk'),
          cancelButtonText: i18n.global.t('com.btnCancel'),
          type: 'warning',
        })
          .then(() => {
            onLogin(true)
          })
          .catch(() => {})
      } else {
        ElMessageBox.alert(msg, '', {
          type: 'error',
          showClose: false,
          confirmButtonText: i18n.global.t('com.btnOk'),
        })
      }
    })
    .finally(() => {
      // console.log('请求结束')
      isRequesting.value = false
    })
}
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
  width: 360px;
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

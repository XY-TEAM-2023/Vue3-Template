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
          <el-button v-menu="menuItems" type="primary" :loading="isRequesting" @click="onLogin(false)">
            {{ $t('loginView.loginBtn') }}
          </el-button>
        </div>
        <div v-if="false">
          <el-button v-menu="menuItems" type="info" :loading="isRequesting" @click="ShowBindOtp">
            {{ $t('otp.titleBind') }}
          </el-button>
          <el-button v-menu="menuItems" type="info" :loading="isRequesting" @click="ShowCheckOtp">
            {{ $t('otp.titleCheck') }}
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
import { ElMessage, ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import { http_post } from '@/axios'
import { isMobile } from '@/utils'
import Dialog from '@/ui/components/DIalog/Dialog'

const userStore = useUserStore()

const account = ref('')
const password = ref('')

const menuItems = [
  { text: '选项1', icon: 'Finished', hoverColor: '#FF0000', action: () => console.log('选项1被点击') },
  {
    text: '选项2',
    icon: `<svg t='1703992207510' class='icon' viewBox='0 0 1026 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2478' width='32' height='32'><path d='M347.64 546.3l103.28 357.77 498.07-720zM334.72 523.93l614.27-339.86-872.55 71.61z' fill='#040000' p-id='2479'></path></svg>`,
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
function onLogin(isForce = false, otpCode = '') {
  isRequesting.value = true
  // 用户登录
  http_post(
    '/api/admin/user/login',
    {
      account: account.value,
      password: password.value,
      force: isForce,
      device: isMobile() ? 'mobile' : 'pc',
      code: otpCode,
    },
    false
  )
    .then((data) => {
      // 刷新用户全局数据，记录登录状态
      userStore.loginSuccess(account.value, data)
      console.log('>>>>>>>>>>>登录成功', userStore.homePage, data)
      // 跳转页面
      router.push({ name: userStore.homePage })
      isRequesting.value = true
    })
    .catch(({ status, msg, data }) => {
      isRequesting.value = false
      console.log('>>>>>>>>>>>登录失败', msg)
      // 已经有人登录过了
      if (status === 12) {
        ElMessageBox.confirm(msg, '', {
          confirmButtonText: i18n.global.t('com.btnOk'),
          cancelButtonText: i18n.global.t('com.btnCancel'),
          type: 'warning',
        })
          .then(() => {
            onLogin(true)
          })
          .catch(() => {})
      } else if (status === 31) {
        // 需要绑定OTP
        Dialog.QRCode({
          title: 'otp.titleBind',
          content: data.otp_url,
          desc: 'otp.bindDesc',
          submitBtnLabel: 'otp.btnNext',
          onClose: () => {
            // 取消绑定
          },
          onSubmit: (cancelCb, closeCb) => {
            // 验证
            closeCb()
            Dialog.input({
              title: 'otp.titleCheck',
              maxLength: 6,
              onClose: () => {},
              onSubmit: (value, cancelCb, closeCb) => {
                if (value === '') {
                  cancelCb()
                } else {
                  onLogin(isForce, value)
                  closeCb()
                }
              },
            })
          },
        })
      } else if (status === 32) {
        Dialog.input({
          title: 'otp.titleCheck',
          maxLength: '6',
          onClose: () => {},
          onSubmit: (value, cancelCb, closeCb) => {
            if (value === '') {
              cancelCb()
            } else {
              onLogin(isForce, value)
              closeCb()
            }
          },
        })
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
      // isRequesting.value = false
    })
}

function ShowBindOtp(otp_url) {
  Dialog.QRCode({
    title: 'otp.titleBind',
    content: otp_url,
    desc: 'otp.bindDesc',
    submitBtnLabel: 'otp.btnNext',
    onClose: () => {
      console.log('取消')
    },
    onSubmit: (cancelCb, closeCb) => {
      console.log('点击了下一步')
    },
  })
}

function ShowCheckOtp() {
  Dialog.input({
    title: 'otp.titleCheck',
    onClose: () => {},
    onSubmit: (newValue, cancelCb, closeCb) => {
      http_post('/otp/check', { code: newValue }, false)
        .then(() => {
          // TODO: 验证成功
          closeCb()
        })
        .catch(() => {
          // TODO: 验证失败
          cancelCb()
        })
    },
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

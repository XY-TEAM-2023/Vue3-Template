<template>
  <el-dropdown size="large" :trigger="trigger">
    <span class="el-dropdown-link">
      <el-avatar :size="props.size" :icon="UserFilled" />
    </span>

    <template #dropdown>
      <el-dropdown-menu class="unselect">
        <el-dropdown-item @click="onUserInfo">{{ $t('userInfoView.router') }}</el-dropdown-item>
        <el-dropdown-item @click="onSingOut"> {{ $t('app.signOut') }} </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { defineProps } from 'vue'
import { useUserStore } from '@/stores/user'
import { UserFilled } from '@element-plus/icons-vue'
import router from '@/router'
import { config } from '@/config'

/** 作为组件时，外部传参 */
const props = defineProps({
  size: {
    type: Number,
    default: 50,
  },
})

const trigger = 'click' //  isMobile() ? 'click' : 'hover'

/** 用户全局数据对象 */
const userStore = useUserStore()

/** 跳转到用户页面 */
function onUserInfo() {
  console.log('跳转到用户页面')
}

/** 注销 */
function onSingOut() {
  userStore.logout()
  router.push(config.router.loginPage)
}
</script>

<style scoped lang="scss">
/* 组件样式 */
$color-icon: #f6f1f1;
$color-bg: #1c1c1c;

.el-avatar {
  background-color: #1c1c1c;
  color: #f6f1f1;
  font-size: 22px;
}
.el-avatar:hover {
  background-color: $color-icon;
  color: $color-bg;
  cursor: pointer;
}

.user-name {
  //color: #000 !important;
  font-weight: bold;
}
</style>

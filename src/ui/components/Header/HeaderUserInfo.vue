<template>
  <header-base width="130" can-hover>
    <template #default>
      <el-icon size="18">
        <UserFilled />
      </el-icon>

      {{ userStore.account }}
    </template>

    <template #dropdown>
      <!--        <el-dropdown-item @click="onUserInfo">{{ $t('userInfoView.router') }}</el-dropdown-item>-->
      <el-dropdown-item @click="onSingOut"> {{ $t('app.signOut') }}</el-dropdown-item>
    </template>
  </header-base>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { UserFilled } from '@element-plus/icons-vue'
import HeaderBase from '@/ui/components/Header/HeaderBase.vue'

/** 用户全局数据对象 */
const userStore = useUserStore()

/** 跳转到用户页面 */
function onUserInfo() {
  console.log('跳转到用户页面')
}

/** 注销 */
function onSingOut() {
  userStore.logout(true)
}
</script>

<style scoped lang="scss"></style>

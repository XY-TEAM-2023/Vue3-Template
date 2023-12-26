<template>
  <el-config-provider :locale="locale" :class="appStore.themeDarkMode ? 'theme-dark' : 'theme-light'">
    <RouterView />
  </el-config-provider>
</template>

<script setup>
// ElementPlus 的国际化配置
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import ko from 'element-plus/dist/locale/ko.mjs'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { RouterView } from 'vue-router'
import '@/styles/theme/index.scss'

const appStore = useAppStore()
const locale = computed(() => {
  switch (appStore.language) {
    case 'zh':
      return zhCn
    case 'en':
      return en
    case 'ko':
      return ko
    default:
      return en
  }
})
</script>

<style></style>

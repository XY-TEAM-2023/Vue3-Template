<template>
  <el-menu
    background-color="transparent"
    :text-color="config.router.admin.textColor"
    :active-text-color="config.router.admin.activeTextColor"
    :default-active="appStore.routerPath"
    :router="true"
    :mode="mode"
    :collapse="appStore.menuIsCollapse"
    :collapse-transition="false"
    class="unselect menu"
  >
    <template v-for="(route, index) in layoutRoutes" :key="index">
      <ui-navigation-item-desktop :route="route" />
    </template>
  </el-menu>
</template>

<script setup>
import UiNavigationItemDesktop from './UiNavigationItemDesktop.vue'
import router from '@/router'
import { useAppStore } from '@/stores/app'
import { config } from '@/config'
import { computed } from 'vue'

const appStore = useAppStore()

const mode = computed(() => (config.websiteModel === 'website' ? 'horizontal' : 'vertical'))

const layoutRoutes = computed(() => {
  const routes = router.config.find((obj) => obj.fullPath === '/')
  return routes.children
})
</script>

<style scoped>
.menu {
  width: 100%;
  height: 100%;
  border-right: none;
  border-bottom: none;
}
.el-header {
  padding: 0 0 0 0;
}
</style>

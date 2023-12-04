<template>
  <el-menu
    :background-color="config.router.admin.backgroundColor"
    :text-color="config.router.admin.textColor"
    :active-text-color="config.router.admin.activeTextColor"
    :default-active="appStore.routerPath"
    :router="true"
    :mode="mode"
    popper-effect="dark"
  >
    <template v-for="(route, index) in router.config" :key="index">
      <ui-navigation-item :route="route" />
    </template>
  </el-menu>
</template>

<script setup>
import UiNavigationItem from './UiNavigationItem.vue'
import router from '@/router'
import { useAppStore } from '@/stores/app'
import { config } from '@/config'
import { computed } from 'vue'

const appStore = useAppStore()

const mode = computed(() => (config.websiteModel === 'website' ? 'horizontal' : 'vertical'))
</script>
<style>
.el-menu {
  width: 100%;
  height: 100%;
}
.el-header {
  padding: 0 0 0 0;
}
</style>

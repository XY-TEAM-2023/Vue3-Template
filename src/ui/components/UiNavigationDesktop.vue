<template>
  <el-menu
    :background-color="props.backgroundColor"
    :text-color="props.textColor"
    :active-text-color="props.activeTextColor"
    :default-active="props.defaultActive"
    :router="props.router"
    :mode="props.mode"
    :collapse="props.collapse"
    :menu-trigger="props.menuTrigger"
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
import { computed, defineProps } from 'vue'

const props = defineProps({
  backgroundColor: {
    type: String,
    default: '',
  },
  textColor: {
    type: String,
    default: '',
  },
  activeTextColor: {
    type: String,
    default: '',
  },
  defaultActive: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: '',
  },
  isRouter: {
    type: Boolean,
    default: true,
  },
  collapse: {
    type: Boolean,
    default: false,
  },
  menuTrigger: {
    type: String,
    default: 'hover',
  },
})

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

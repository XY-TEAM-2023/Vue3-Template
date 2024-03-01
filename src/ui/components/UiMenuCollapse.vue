<template>
  <!--  菜单栏折叠按钮  -->
  <el-icon size="21" class="layout-menu-btn" @click="appStore.menuIsCollapse = !appStore.menuIsCollapse">
    <Expand v-if="appStore.menuIsCollapse" />
    <Fold v-else />
  </el-icon>
</template>

<script setup>
import { Expand, Fold } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<style scoped lang="scss"></style>

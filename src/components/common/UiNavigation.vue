<template>
  <el-menu active-text-color="#ffd04b" background-color="#545c64" text-color="#fff">
    <template v-for="(route, index) in router.config" :key="index">
      <ui-navigation-item :route="route" />
    </template>
  </el-menu>
</template>

<script setup>
import UiNavigationItem from './UiNavigationItem.vue'
import router from '@/router'
</script>
<style>
.el-menu {
  width: 100%;
  height: 100%;
}
</style>

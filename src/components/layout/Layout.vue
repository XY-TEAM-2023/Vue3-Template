<template>
  <div id="app">
    <el-container>
      <el-aside width="220px">
        <ui-navigation :routes="routes"></ui-navigation>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import UiNavigation from '@/components/common/UiNavigation.vue'
import { RouterView } from 'vue-router'

export default {
  name: 'UiLayout',
  components: {
    RouterView,
    UiNavigation,
  },
  data() {
    return {
      routes: this.$router.options.routes, // 获取路由配置
    }
  },
}
</script>

<style>
/* 样式可以根据需求进行自定义 */
</style>

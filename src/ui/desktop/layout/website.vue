<template>
  <div id="app">
    <el-container>
      <el-header width="220px">
        <ui-navigation :routes="routes"></ui-navigation>
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import UiNavigation from '@/ui/desktop/components/UiNavigation.vue'
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

<style></style>

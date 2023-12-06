<template>
  <div id="app">
    <el-container>
      <el-aside width="220px">
        <ui-logo></ui-logo>
        <ui-navigation :routes="routes"></ui-navigation>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import UiNavigation from '@/ui/desktop/components/UiNavigation.vue'
import { RouterView } from 'vue-router'
import UiLogo from '@/ui/desktop/components/UiLogo.vue'

export default {
  name: 'UiLayout',
  components: {
    UiLogo,
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

<style scoped>
/* 样式可以根据需求进行自定义 */
.el-aside {
  display: flex;
  flex-direction: column;
}
</style>

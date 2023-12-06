<template>
  <div id="app">
    <el-container>
      <el-main style="height: 0; flex-grow: 1">
        <el-scrollbar>
          <RouterView />
        </el-scrollbar>
      </el-main>

      <el-footer height="84px">
        <ui-navigation :routes="routes"></ui-navigation>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import UiNavigation from '@/ui/mobile/components/UiNavigation.vue'
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

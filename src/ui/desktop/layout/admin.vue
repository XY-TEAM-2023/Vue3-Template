<template>
  <div id="app">
    <el-container class="layout">
      <el-header class="layout-top">
        <ui-logo />
        <div class="layout-top-icon">
          <ui-icon-login :size="35" />
        </div>
      </el-header>
      <div class="layout-bottom">
        <el-aside width="200px" class="layout-bottom-aside">
          <el-scrollbar>
            <ui-navigation :routes="routes"></ui-navigation>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <el-scrollbar class="layout-bottom-main">
            <RouterView />
          </el-scrollbar>
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script>
import UiNavigation from '@/ui/desktop/components/UiNavigation.vue'
import { RouterView } from 'vue-router'
import UiLogo from '@/ui/desktop/components/UiLogo.vue'
import UiIconLogin from '@/ui/desktop/components/UiIconLogin.vue'

export default {
  name: 'UiLayout',
  components: {
    UiIconLogin,
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

<style scoped lang="scss">
$header-height: 60px; // 顶部区域高度
$layout-top-bg-color: #2f3243; // 顶部区域背景色
$layout-aside-bg-color: #2f3243; // 左侧区域背景色

.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.layout-top {
  height: $header-height;
  align-items: center;
  // 背景颜色
  background-color: $layout-top-bg-color;
  // 底部阴影
  box-shadow: inset 0 -10px 4px -10px rgba(0, 0, 0, 1);
}

.layout-top-icon {
  margin-left: auto !important;
  margin-right: 20px;
}

.layout-bottom-aside {
  display: flex;
  flex-direction: column;
  height: 100% !important;
  overflow-y: auto;
  // 右边阴影
  box-shadow: inset -10px 0 4px -10px rgba(0, 0, 0, 1) !important;
  background-color: $layout-aside-bg-color;
}

.layout-bottom {
  display: flex;
  flex-direction: row;
  height: calc(100vh - #{$header-height}); // 使用变量并在 calc 函数中插入
  overflow-y: auto;
}

.layout-bottom-main {
  width: 100%;
}
</style>

<template>
  <div id="app">
    <el-container class="layout">
      <el-header class="layout-top">
        <ui-logo />

        <!-- 自动填充 -->
        <div class="layout-top-auto-margin" />

        <div class="layout-top-i18n">
          <ui-i18n />
        </div>
        <ui-icon-login :size="35" class="layout-top-icon" />
      </el-header>
      <div class="layout-bottom">
        <el-aside width="200px" class="layout-bottom-aside">
          <el-scrollbar>
            <ui-navigation-desktop :routes="routes"></ui-navigation-desktop>
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
import { RouterView } from 'vue-router'
import UiLogo from '@/ui/components/UiLogo.vue'
import UiIconLogin from '@/ui/components/UiIconLogin.vue'
import UiI18n from '@/ui/components/UiI18n.vue'
import UiNavigationDesktop from '@/ui/components/UiNavigationDesktop.vue'

export default {
  name: 'UiLayout',
  components: {
    UiNavigationDesktop,
    UiI18n,
    UiIconLogin,
    UiLogo,
    RouterView,
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
  display: flex;
  flex-direction: row;
  padding-right: 20px !important;
  // 背景颜色
  background-color: $layout-top-bg-color;
  // 底部阴影
  box-shadow: inset 0 -10px 4px -10px rgba(0, 0, 0, 1);
}

.layout-top-auto-margin {
  margin-left: auto !important;
}

.layout-top-i18n {
  display: flex;
}

.layout-top-icon {
  margin-left: 15px;
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

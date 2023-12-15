<template>
  <div id="app">
    <el-container class="layout">
      <el-aside :width="asideWidth" class="layout-aside">
        <ui-logo class="layout-aside-logo" />
        <el-scrollbar>
          <ui-navigation-desktop :routes="router.options.routes" />
        </el-scrollbar>
      </el-aside>

      <el-container>
        <el-header class="layout-header">
          <!--  菜单栏折叠按钮  -->
          <el-icon size="21" class="layout-menu-btn" @click="appStore.menuIsCollapse = !appStore.menuIsCollapse">
            <Expand v-if="appStore.menuIsCollapse" />
            <Fold v-else />
          </el-icon>

          <div style="width: 14px" />

          <!--  面包屑  -->
          <ui-breadcrumb />

          <!-- 自动填充 -->
          <div class="layout-top-auto-margin" />

          <div class="layout-top-i18n">
            <ui-i18n />
          </div>

          <ui-icon-login :size="35" class="layout-top-icon" />
        </el-header>

        <ui-toolbar></ui-toolbar>

        <div class="layout-bottom">
          <el-main class="layout-main">
            <div class="layout-main-content">
              <el-scrollbar>
                <RouterView />
              </el-scrollbar>
            </div>
          </el-main>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import UiLogo from '@/ui/components/UiLogo.vue'
import UiIconLogin from '@/ui/components/UiIconLogin.vue'
import UiI18n from '@/ui/components/UiI18n.vue'
import UiNavigationDesktop from '@/ui/components/UiNavigationDesktop.vue'
import UiToolbar from '@/ui/components/UiToolbar.vue'
import UiBreadcrumb from '@/ui/components/UiBreadcrumb.vue'
// eslint-disable-next-line no-unused-vars
import { Expand, Fold } from '@element-plus/icons-vue'
import router from '@/router'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const asideWidth = computed(() => (appStore.menuIsCollapse ? '63px' : '255px'))
</script>

<style scoped lang="scss">
$header-height: 60px; // 顶部区域高度
$layout-top-bg-color: #fff; // 顶部区域背景色
$layout-aside-bg-color: #2f3447; // 左侧区域背景色
$layout-main-bg-color: #f5f5f5; // 主区域背景色
$layout-main-content-bg-color: #fff; // 主区域内容背景色

.layout {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
}

.layout-header {
  height: $header-height;
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 0 10px !important;
  background-color: $layout-top-bg-color;
  //box-shadow: inset 0 -10px 4px -10px rgba(0, 0, 0, 1); // 底部阴影
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

.layout-aside {
  display: flex;
  flex-direction: column;
  height: 100% !important;
  overflow-y: auto;
  // 右边阴影
  //box-shadow: inset -10px 0 4px -10px rgba(0, 0, 0, 1) !important;
  background-color: $layout-aside-bg-color;
  transition: width 0.2s;
}

.layout-menu-btn {
  color: #2c3e4f;
  cursor: pointer;
  width: 30px;
  height: 30px;
}
.layout-menu-btn:hover {
  color: #2299dd;
}
.layout-menu-btn:not(:last-child) {
  margin-right: 4px;
}

.layout-aside-logo {
  min-height: $header-height;
  height: $header-height;
}

.layout-bottom {
  display: flex;
  flex-direction: row;
  height: calc(100vh - #{$header-height}); // 使用变量并在 calc 函数中插入
  overflow-y: auto;
}

.layout-main {
  width: 100%;
  background-color: $layout-main-bg-color;
  padding: 0 10px 10px !important;
}

.layout-main-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: $layout-main-content-bg-color;
}
</style>

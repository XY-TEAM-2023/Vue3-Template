<template>
  <div id="app">
    <el-container class="layout">
      <el-header class="layout-header">
        <ui-logo />
        <ui-navigation-desktop
          :routes="router.options.routes"
          :background-color="config.router.admin.backgroundColor"
          :text-color="config.router.admin.textColor"
          :active-text-color="config.router.admin.activeTextColor"
          :default-active="appStore.routerPath"
          :router="true"
          mode="horizontal"
          class="layout-navigation"
        />
        <div class="layout-top-icon">
          <ui-icon-login :size="35" />
        </div>
      </el-header>
      <el-main style="width: 100%; height: 100%">
        <el-scrollbar style="width: 100%; height: 100%">
          <div style="padding: 10px 10px 10px 10px; width: 100%">
            <RouterView />
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import UiLogo from '@/ui/components/UiLogo.vue'
import UiIconLogin from '@/ui/components/Header/HeaderUserInfo.vue'
import UiNavigationDesktop from '@/ui/components/UiNavigationDesktop.vue'
import router from '@/router'
import { useAppStore } from '@/stores/app'
import { config } from '@/config'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
// 顶部菜单高度
$header-height: 60px;
// 顶部背景颜色
$header-background-color: #2f3243;
// 内容宽度
$layout-width: 100%;

.layout {
  width: $layout-width;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  align-items: center;
}

.layout-header {
  width: 100%;
  height: $header-height;
  // 背景颜色
  background-color: $header-background-color;
  // 底部阴影
  box-shadow: inset 0 -10px 4px -10px rgba(0, 0, 0, 1);
}

.layout-navigation {
  margin-left: 20px;
}

.layout-top-icon {
  margin-left: auto !important;
  margin-right: 20px;
}
</style>

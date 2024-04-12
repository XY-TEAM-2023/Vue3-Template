<template>
  <div id="app">
    <el-container class="layout">
      <el-aside :width="asideWidth" class="layout-aside">
        <ui-logo class="layout-aside-logo"/>
        <el-scrollbar style="margin-top: 60px" class="layout-aside-menu">
          <ui-navigation-desktop
              :routes="router.options.routes"
              :background-color="config.router.admin.backgroundColor"
              :text-color="config.router.admin.textColor"
              :active-text-color="config.router.admin.activeTextColor"
              :default-active="appStore.routerPath"
              :is-router="true"
              :mode="mode"
              :collapse="appStore.menuIsCollapse"
          />
        </el-scrollbar>
      </el-aside>

      <el-container>
        <el-header class="layout-header">
          <div style="width: 14px"/>

          <!--  面包屑  -->
          <ui-breadcrumb/>

          <!-- 自动填充 -->
          <div class="layout-top-auto-margin"/>

          <header-time/>
          <div class="header-line"/>
          <header-user-info/>
          <div class="header-line"/>
          <header-role/>
          <div class="header-line"/>
          <header-i18n/>
        </el-header>

        <div class="layout-bottom">
          <!--          <el-main class="layout-main">-->
          <ui-toolbar style="padding-left: 15px; padding-right: 15px"/>

          <div ref="mainAreaRef" class="layout-main-content">
            <el-scrollbar style="height: 100%; max-height: 100%;  padding: 0 15px;" always>
              <RouterView/>
            </el-scrollbar>
          </div>
          <!--          </el-main>-->
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {ref, computed, onMounted, onBeforeUnmount, onUnmounted, nextTick, provide} from 'vue'
import {RouterView, useRoute} from 'vue-router'
import UiLogo from '@/ui/components/UiLogo.vue'
import UiI18n from '@/ui/components/UiI18n.vue'
import UiNavigationDesktop from '@/ui/components/UiNavigationDesktop.vue'
import UiToolbar from '@/ui/components/UiToolbar.vue'
import UiBreadcrumb from '@/ui/components/UiBreadcrumb.vue'
// eslint-disable-next-line no-unused-vars
import {Expand, Fold} from '@element-plus/icons-vue'
import router from '@/router'
import {useAppStore} from '@/stores/app'
import {config} from '@/config'
import HeaderUserInfo from '@/ui/components/Header/HeaderUserInfo.vue'
import HeaderI18n from '@/ui/components/Header/HeaderI18n.vue'
import HeaderTime from '@/ui/components/Header/HeaderTime.vue'
import HeaderRole from '@/ui/components/Header/HeaderRole.vue'

const route = useRoute()
const mainAreaRef = ref(null)
const mainAreaStyle = ref({height: '300px'})
const resizeObserver = new ResizeObserver(() => {
  calcMainAreaStyle()
})
onMounted(() => {
  resizeObserver.observe(mainAreaRef.value)
  calcMainAreaStyle()
})

onBeforeUnmount(() => {
  resizeObserver.unobserve(mainAreaRef.value)
})

function calcMainAreaStyle() {
  nextTick(() => {
    mainAreaStyle.value.height = mainAreaRef.value.clientHeight + 'px'
    // console.log(mainAreaStyle.value.height)
  })
}

const appStore = useAppStore()
const mode = computed(() => (config.websiteModel === 'website' ? 'horizontal' : 'vertical'))
const asideWidth = computed(() => (appStore.menuIsCollapse ? '63px' : '255px'))
</script>

<style scoped lang="scss">
$header-height: 50px; // 顶部区域高度
$layout-top-bg-color: #fff; // 顶部区域背景色
$layout-aside-bg-color: #fff; // 左侧区域背景色
$layout-main-bg-color: #eff0f4; // 主区域背景色
$layout-main-content-bg-color: #eff0f4; // 主区域内容背景色

.layout {
  height: 100%;
  display: flex;
  flex-direction: row;
}

.layout-header {
  height: $header-height;
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 0 10px !important;
  background-color: $layout-top-bg-color;
}

.layout-top-auto-margin {
  margin-left: auto !important;
}

.layout-aside {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100% !important;
  overflow-y: auto;
  // 右边阴影
  background-color: $layout-aside-bg-color;
  transition: width 0.4s;
  //box-shadow: 3px 0 8px 0 rgba(119, 119, 119, 0.3);
  box-shadow: var(--el-box-shadow-light);
}

.layout-aside-menu {
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
  //box-shadow: -3px 3px 15px -6px rgba(119, 119, 119, 0.3);
  box-shadow: var(--el-box-shadow-light);
  z-index: 1;
}

.layout-bottom {
  display: flex;
  flex-direction: column;
  height: calc(100vh - #{$header-height}); // 使用变量并在 calc 函数中插入
}

.layout-main {
  width: 100%;
  height: 100%;
  background-color: $layout-main-bg-color;
  padding: 0 0 0 0 !important;
}

.layout-main-content {
  display: inline-block;
  width: 100%;
  height: calc(100% - 50px);
  box-sizing: border-box;
  background-color: $layout-main-content-bg-color;

  :deep(.el-scrollbar__view:first-child:not(.el-scrollbar__view .el-scrollbar__view)) {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 0 15px 0;
  }
}

.header-line {
  height: 20px;
  margin-left: 5px;
  margin-right: 5px;
  border-left: 1px solid #e6eaee;
}
</style>

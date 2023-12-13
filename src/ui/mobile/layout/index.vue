<template>
  <div id="app">
    <el-container>
      <el-header class="layout-top">
        <ui-logo />
        <div class="layout-top-icon">
          <ui-icon-login :size="38" />
        </div>
      </el-header>
      <el-main style="height: 0; flex-grow: 1">
        <el-scrollbar style="width: 100%">
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
import UiLogo from '@/ui/mobile/components/UiLogo.vue'
import UiIconLogin from '@/ui/mobile/components/UiIconLogin.vue'

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
// 顶部菜单高度
$header-height: 60px;
// 顶部背景颜色
$header-background-color: #333333;

.layout-top {
  width: 100%;
  height: $header-height;
  // 背景颜色
  background-color: $header-background-color;
  // 底部阴影
  box-shadow: inset 0 -10px 4px -10px rgba(0, 0, 0, 1);
}

.layout-top-icon {
  margin-left: auto !important;
  margin-right: 20px;
}
</style>

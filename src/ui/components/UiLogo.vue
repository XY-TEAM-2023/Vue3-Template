<template>
  <div v-if="config.logo.display" class="ui-logo unselect">
    <!--  图标  -->
    <el-icon v-if="config.logo.icon" :size="config.logo.iconSize" color="#FFFFFF">
      <component v-if="!config.logo.icon.includes('<')" :is="config.logo.icon" />
      <ui-svg v-else :svg-code="config.logo.icon" svg-color="#FFFFF" />
    </el-icon>

    <!-- 使用计算属性来显示标题 -->
    <span class="text unselect">
      {{ getTitle() }}
    </span>

    <ui-menu-collapse class="menu-collapse" />
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { config } from '@/config'
import UiSvg from '@/ui/components/UiSvg.vue'
import i18n from '@/i18n'
import UiMenuCollapse from '@/ui/components/UiMenuCollapse.vue'

const appStore = useAppStore()

function getTitle() {
  if (config.logo.label.includes('.')) {
    return i18n.global.t(config.logo.label)
  } else {
    return config.logo.label
  }
}
</script>

<style scoped lang="scss">
/* 组件样式 */

.ui-logo {
  position: absolute;
  top: 0;
  right: 0;
  min-height: 60px;
  display: flex;
  width: 255px;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
  //box-shadow: 0 3px 15px rgba(119, 119, 119, 0.4);

  .icon {
    width: 30px;
    height: 30px;
  }

  .text {
    color: #1b9cfb;
    font-weight: 700;
    font-size: 26px;
    vertical-align: baseline;
    white-space: nowrap;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif;
  }
}

.menu-collapse {
  margin-left: auto;
}
</style>

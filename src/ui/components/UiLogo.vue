<template>
  <div v-if="config.logo.display" class="ui-logo unselect">
    <!--  图标  -->
    <el-icon v-if="config.logo.icon" :size="config.logo.iconSize" color="#FFFFFF">
      <component v-if="!config.logo.icon.includes('<')" :is="config.logo.icon" />
      <ui-svg v-else :svg-code="config.logo.icon" svg-color="#FFFFF" />
    </el-icon>

    <!-- 使用计算属性来显示标题 -->
    <span v-if="!appStore.menuIsCollapse" class="text unselect">
      {{ getTitle() }}
    </span>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { config } from '@/config'
import UiSvg from '@/ui/components/UiSvg.vue'
import i18n from '@/i18n'

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
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-shadow: inset 0 -10px 4px -10px rgba(0, 0, 0, 0.5);
  //border-right: solid 1px var(--el-menu-border-color);

  .icon {
    width: 30px;
    height: 30px;
  }
  .text {
    color: #fff;
    font-weight: 700;
    font-size: 26px;
    margin-left: 10px;
    vertical-align: baseline;
    white-space: nowrap;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif;
  }
}
</style>

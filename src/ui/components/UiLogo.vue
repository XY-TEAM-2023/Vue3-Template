<template>
  <div v-if="config.logo.display" class="ui-logo unselect">
    <img src="/favicon.ico" alt="logo" class="icon" />
    <!-- 使用计算属性来显示标题 -->
    <div v-if="!appStore.menuIsCollapse" class="text unselect">{{ appStore.logoLabel }}</div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { config } from '@/config'

const appStore = useAppStore()
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
    white-space: nowrap;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif;
  }
}
</style>

<template>
  <el-dropdown trigger="click">
    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
      <path
        :fill="color"
        d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"
      ></path>
    </svg>

    <template #dropdown>
      <el-radio-group
        v-model="appStore.language"
        style="width: 100px; padding-left: 10px"
        @change="appStore.setLanguage(appStore.language)"
      >
        <el-radio label="ko" model-value>korea</el-radio>
        <el-radio label="zh">chinese</el-radio>
        <el-radio label="en">english</el-radio>
      </el-radio-group>
    </template>
  </el-dropdown>
</template>

<script>
import { useAppStore } from '@/stores/app'

export default {
  name: 'UiI18n',

  // props: 定义组件接收的外部属性
  props: {
    /** 默认颜色 */
    color: {
      type: String, // String、Number、Boolean、Object、Array、Function、Date
      default: '#dddddd',
    },
  },
  // data: 组件的响应式数据
  data() {
    return {
      appStore: useAppStore(),
    }
  },
}
</script>

<style scoped>
/* 鼠标悬停时的颜色 */
svg:hover path {
  fill: #42bb85; /* 设置悬停时的填充颜色为蓝色 */
}

:deep(.el-radio) {
  height: 26px !important;
}

:deep(.el-popper) {
  min-width: 80px !important;
}
</style>

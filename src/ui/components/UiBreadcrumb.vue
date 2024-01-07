<!-- 面包屑组件爱你 -->
<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="unselect">
    <el-breadcrumb-item v-for="(key, index) in breadcrumbs" :key="index">
      {{ key }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { config } from '@/config'
import i18n from '@/i18n'
import { useAppStore } from '@/stores/app'

const route = useRoute()

const appStore = useAppStore()

/** 应用全局数据对象 */
const breadcrumbs = computed(() => {
  const breadcrumbs = []
  const matchedRoutes = route.matched

  matchedRoutes.forEach((route) => {
    const title = route.meta.title[appStore.language]
    if (title) {
      breadcrumbs.push(title)
    }
  })
  // console.error('>>>>>>>>>', matchedRoutes)

  return breadcrumbs
})
</script>

<style scoped lang="scss">
:deep(.el-breadcrumb__inner) {
  font-weight: normal;
  color: #606266;
  cursor: default !important;
}

// 调整箭头两边空白空间
:deep(.el-breadcrumb__separator) {
  margin: 0 4px 0 4px !important;
}
</style>

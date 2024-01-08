<template>
  <!-- 有子菜单 -->
  <ui-navigation-item-mobile v-if="isShowGroup" v-for="subRoute in route.children" :key="subRoute.path" :route="subRoute" />

  <!-- 菜单按钮 -->
  <router-link v-else-if="isShowItem" :to="route.fullPath" @click="navigateTo(route.fullPath)">
    <!--  显示小红点  -->
    <el-badge :is-dot="!redDotValue" :value="redDotValue" :hidden="!showRedDot" class="nav-item">
      <el-icon v-if="checkIsShowIcon(route)" :size="config.router.mobile.iconSize">
        <component v-if="isElementIcon(route.meta.icon)" :is="route.meta.icon" />
        <ui-svg v-else :svg-code="route.meta.icon" svg-color="#FFFFF" />
      </el-icon>

      <span class="text">
        {{ getTitle(route) }}
      </span>
    </el-badge>
  </router-link>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { defineProps, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { config } from '@/config'
import UiSvg from '@/ui/components/UiSvg.vue'

const router = useRouter()
const props = defineProps({
  route: Object,
})

const appStore = useAppStore()

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 路由相关
const navigateTo = (path) => {
  if (path === router.currentRoute.value.fullPath) {
    router.push({ path: '/refresh', query: { redirect: path } })
  } else {
    router.push(path)
  }
  appStore.tryHideRouteRedDot(path)
}

function isElementIcon(icon) {
  return !icon.includes('.')
}

function getTitle(obj) {
  return obj.meta.title[appStore.language]
}

/**
 * 检查是否为菜单组
 */
function checkIsGroup(obj) {
  return obj.children && obj.children.length > 0
}

/**
 * 检查是否显示
 */
function checkIsShow(obj) {
  return !obj.meta || obj.meta.hidden === undefined || !obj.meta.hidden
}

/**
 * 检查是否显示图标
 * @param obj
 * @returns {boolean}
 */
function checkIsShowIcon(obj) {
  return obj.meta && obj.meta.icon
}

/**
 * 检查菜单组是否显示
 */
function checkIsShowGroup(obj) {
  if (!checkIsGroup(obj)) {
    return false
  }

  if (!checkIsShow(obj)) {
    return false
  }

  // 判断是否有要显示的子菜单

  for (const key in obj.children) {
    const item = obj.children[key]
    // 菜单分组
    if (checkIsGroup(item)) {
      return checkIsShowGroup(item)
    }

    // 是否显示菜单
    if (checkIsShowItem(item)) {
      return true
    }
  }

  return false
}

/**
 * 检查菜单是否显示
 * @param obj
 * @returns {boolean}
 */
function checkIsShowItem(obj) {
  if (checkIsGroup(obj)) {
    return false
  }

  if (!obj.component) {
    return false
  }

  return checkIsShow(obj)
}

/**
 * 是否显示菜单分组
 * @type {ComputedRef<boolean|*>}
 */
const isShowGroup = computed(() => {
  return checkIsShowGroup(props.route)
})

/**
 * 是否显示菜单
 * @type {ComputedRef<boolean>}
 */
const isShowItem = computed(() => {
  return checkIsShowItem(props.route)
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 小红点相关
/** 是否显示小红点 */
const showRedDot = computed(() => appStore.isShowRouteRedDot(props.route.fullPath))
/** 小红点显示内容 */
const redDotValue = computed(() => appStore.getRouteRedDotValue(props.route.fullPath))

// 测试路由小红点
// appStore.setRouteRedDot(props.route.fullPath, '', false)
// appStore.setRouteRedDot(props.route.fullPath, '18', true)
</script>

<style scoped>
.nav-item {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto; /* 不要伸缩，避免被压缩 */
  width: 90px;
  min-width: 90px;
  height: 100%;
  text-align: center;
  color: white;
  text-decoration: none;
  margin-top: 2px;
  justify-content: center; /* 水平方向靠左对齐 */
  align-items: center; /* 垂直方向靠上对齐 */
}

.nav-item + .nav-item {
  margin-left: 40px;
}

.icon {
  display: block;
}

.text {
  font-size: 12px;
}

:deep(.el-badge__content) {
  margin-right: 16px !important;
}
</style>

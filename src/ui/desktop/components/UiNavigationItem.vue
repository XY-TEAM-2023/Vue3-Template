<template>
  <!-- 有子菜单 -->
  <el-sub-menu v-if="isShowGroup" :index="fullPath">
    <template #title>
      <!--  图标  -->
      <component
        v-if="checkIsShowIcon(route)"
        :is="route.meta.icon"
        :width="config.router.admin.iconSize"
        :height="config.router.admin.iconSize"
        style="margin-right: 10px"
      ></component>
      <!--  菜单名  -->
      {{ route.name }}
      <!--  小红点  -->
      <el-badge v-if="showRedDotGroup" :is-dot="true" :hidden="false">
        <div style="margin-left: 15px"></div>
      </el-badge>
    </template>
    <ui-navigation-item v-for="subRoute in route.children" :key="subRoute.path" :route="subRoute" :parent-path="fullPath" />
  </el-sub-menu>

  <!-- 无子菜单 -->
  <el-menu-item v-else-if="isShowItem" :index="fullPath" @click="navigateTo(route.path)">
    <!--  图标  -->
    <component
      v-if="checkIsShowIcon(route)"
      :is="route.meta.icon"
      :width="config.router.admin.iconSize"
      :height="config.router.admin.iconSize"
      style="margin-right: 10px"
    ></component>
    <!--  菜单名  -->
    {{ route.name }}
    <!--  小红点  -->
    <el-badge v-if="showRedDot" :is-dot="!redDotValue" :value="redDotValue" :hidden="false">
      <div style="margin-left: 15px"></div>
    </el-badge>
  </el-menu-item>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { defineProps, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { config } from '@/config'

const router = useRouter()
const props = defineProps({
  route: Object,
  parentPath: String,
})

const appStore = useAppStore()

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 路由相关
/** 当前路由完整路径 */
const fullPath = computed(() => {
  return (props.parentPath ? props.parentPath : '') + props.route.path
})

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
//
// console.log('-------------------------- ', props.route.path)
// console.log('isShowItem', isShowItem.value)
// console.log('isShowGroup', isShowGroup.value)

const navigateTo = (path) => {
  appStore.tryHideRouteRedDot(path)
  router.push(path)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 小红点相关
/** 是否显示小红点 */
const showRedDot = computed(() => appStore.isShowRouteRedDot(props.route.path))
/** 小红点显示内容 */
const redDotValue = computed(() => appStore.getRouteRedDotValue(props.route.path))
/** 是否显示分区的小红点 */
const showRedDotGroup = computed(() => {
  if (!checkIsGroup(props.route)) {
    return false
  }

  if (!checkIsShow(props.route)) {
    return false
  }

  // 判断是否有要显示的子菜单
  for (const key in props.route.children) {
    const item = props.route.children[key]
    // 菜单分组
    if (checkIsGroup(item)) {
      return checkIsShowGroup(item)
    }

    // 是否显示菜单
    if (checkIsShowItem(item)) {
      // 是否有小红点显示
      if (appStore.isShowRouteRedDot(item.path) && !appStore.getRouteRedDotIsLooked(item.path)) {
        return true
      }
    }
  }
  return false
})

// 测试路由小红点
// appStore.setRouteRedDot(props.route.path, '', false)
appStore.setRouteRedDot(props.route.path, '18', true)
</script>

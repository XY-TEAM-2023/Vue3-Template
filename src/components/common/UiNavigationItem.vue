<template>
  <!-- 有子菜单 -->
  <el-sub-menu v-if="isShowGroup" :index="route.path">
    <template #title>
      <component :is="route.meta.icon" :width="icon_width" :height="icon_height" style="margin-right: 10px"></component>
      {{ route.name }}
    </template>
    <ui-navigation-item v-for="subRoute in route.children" :key="subRoute.path" :route="subRoute" />
  </el-sub-menu>

  <!-- 无子菜单 -->
  <el-menu-item v-else-if="isShowItem" :index="route.path" @click="navigateTo(route.path)">
    <component :is="route.meta.icon" :width="icon_width" :height="icon_height" style="margin-right: 10px"></component>
    {{ route.name }}
  </el-menu-item>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { defineProps, computed, ref } from 'vue'

const router = useRouter()
const props = defineProps({
  route: Object,
})

const icon_width = ref(18)
const icon_height = ref(18)

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
  return obj.hidden === undefined || !obj.hidden
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
      console.log('显示分组')
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
  router.push(path)
}
</script>

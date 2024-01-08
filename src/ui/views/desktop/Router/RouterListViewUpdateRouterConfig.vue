<template>
  <el-button type="primary" :disabled="disabled" @click="onUpdate">
    {{ $t('routerListView.btnUpdateMenus') }}
  </el-button>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'
import { http_post } from '@/utils/axios'

const emit = defineEmits(['refresh'])

const props = defineProps({
  fileDict: Object,
  routerList: Array,
  asyncRoutes: Array,
})

const disabled = computed(() => {
  const keys = Object.keys(props.fileDict)
  return !keys || keys.length === 0
})

const isRequesting = ref(false)
// 解析并上传路由配置
async function onUpdate() {
  if (isRequesting.value) {
    return
  }
  isRequesting.value = true

  console.error(props.asyncRoutes)
  const router_config = retainNameField(props.asyncRoutes)

  console.log(props.routerList)

  let router_list_data = []
  props.routerList.forEach((item) => {
    router_list_data.push({
      name: item.name,
      icon: item.icon,
      title: item.title,
      title_en: item.title && item.title.en ? item.title.en : 'undefined',
      title_zh: item.title && item.title.zh ? item.title.zh : 'undefined',
      title_ko: item.title && item.title.ko ? item.title.ko : 'undefined',
      enable_desktop: item.desktop ? 1 : 0,
      enable_mobile: item.mobile ? 1 : 0,
      component: item.component ? item.component : '',
      display: item.display ? 1 : 0,
      cache: item.cache ? 1 : 0,
    })
  })

  // 初始化路由基础配置
  http_post('/api/admin/menu/update', { list: router_list_data, default_config: router_config }, true)
    .then(() => {
      emit('refresh')
    })
    .catch(() => {})
    .finally(() => {
      isRequesting.value = false
    })
}

/** 不改变原始结构的情况下，只保留 name 字段 */
const retainNameField = (obj) => {
  if (Array.isArray(obj)) {
    // 如果是数组，递归处理每个元素
    return obj.map(retainNameField)
  } else if (typeof obj === 'object' && obj !== null) {
    // 如果是对象，创建一个新对象，只保留 name 字段
    let newObj = {}
    if (obj.name) {
      newObj['name'] = obj['name']
    }

    // 对象的每个属性（如果是对象或数组）也递归处理
    if (obj.children && typeof obj.children === 'object') {
      newObj['children'] = retainNameField(obj.children)
    }
    return newObj
  }
  // 非对象或数组的值直接返回
  return obj
}
</script>

<style scoped lang="scss"></style>

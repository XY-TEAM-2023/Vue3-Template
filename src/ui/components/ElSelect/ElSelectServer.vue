<!--  选项使用本地数据  -->
<template>
  <el-select
    :loading="isRequesting"
    v-model="model"
    :clearable="clearable"
    :placeholder="placeholder"
    style="width: 100%"
    @click="requestOptions"
  >
    <template v-for="item in options" :key="item.value">
      <el-option :label="item.label" :value="item.value" />
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { computed, defineProps, defineModel, ref } from 'vue'
import { tryGetI18nText } from '@/utils'
import { http_post } from '@/axios'

const model = defineModel()
const props = defineProps<{
  /** 请求地址, 比如 /user/roles */
  url: String
  /** 响应后options保存的字段 a.b */
  field: String
  /** 支持直接输入国际化的key */
  placeholder?: String
  /** 是否可以清除 */
  clearable?: Boolean
}>()

type OptionStruct = {
  label: String
  value: String | Number
}

const options = ref<OptionStruct>([])
let isInited = false
const isRequesting = ref(false)

const placeholder = computed(() => {
  return tryGetI18nText(props.placeholder)
})

function requestOptions() {
  if (!props.url) {
    console.error('url params is empty!')
  }
  if (isRequesting.value) {
    return
  }
  if (isInited) {
    return
  }
  isRequesting.value = true

  console.log(props.url)
  http_post(props.url, {}, false)
    .then((data) => {
      isInited = true
      const parts = props.field.split('.')
      let obj = data
      parts.forEach((part) => {
        obj = obj[part]
      })

      options.value = obj
      console.log(options.value)
    })
    .catch(() => {})
    .finally(() => {
      // console.log('请求结束')
      isRequesting.value = false
    })
}
</script>

<style scoped lang="scss"></style>

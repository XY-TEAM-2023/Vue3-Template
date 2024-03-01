<!--  选项使用本地数据  -->
<template>
  <el-select
    :multiple="props.multiple"
    :collapse-tags-tooltip="props.collapseTagsTooltip"
    :max-collapse-tags="props.maxCollapseTags"
    v-model="model"
    v-loading="isRequesting"
    :clearable="clearable"
    :placeholder="placeholder"
    style="width: 100%"
    @click="requestOptions"
  >
    <template #header v-if="props.multiple">
      <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll"> All</el-checkbox>
    </template>

    <template v-for="item in options" :key="item.value">
      <el-option :label="item.label" :value="item.value" />
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { computed, defineProps, defineModel, ref, watch, onMounted } from 'vue'
import { tryGetI18nText } from '@/utils'
import { http_post } from '@/axios'
import { forEach } from 'lodash-es'

const checkAll = ref(false)
const model = defineModel()
const indeterminate = ref(false)
const props = defineProps<{
  /** 请求地址, 比如 /user/roles */
  url: String
  /** 响应后options保存的字段 a.b */
  field: String
  /** 选项对应的文本 */
  fieldLabel: String
  /** 选项对应的值 */
  fieldValue: String
  /** 支持直接输入国际化的key */
  placeholder?: String
  /** 是否可以清除 */
  clearable?: Boolean
  /** 多选 */
  multiple?: Boolean
  /** 多选多少个选项后开始折叠 */
  maxCollapseTags?: Number
  /** 多选折叠显示 */
  collapseTagsTooltip?: Boolean
}>()

type OptionStruct = {
  label: String
  value: String | Number
}

const options = ref<OptionStruct[]>()
let isInited = false
const isRequesting = ref(false)

const placeholder = computed(() => {
  return tryGetI18nText(props.placeholder)
})

onMounted(() => {
  requestOptions()
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

      // 取返回的数据数组
      const pathData = props.field.split('.')
      let resTable = data
      pathData.forEach((part) => {
        resTable = resTable[part]
      })

      const temp_options = []
      resTable.forEach((obj) => {
        temp_options.push({
          label: obj[props.fieldLabel],
          value: obj[props.fieldValue],
        })
      })

      options.value = temp_options
    })
    .catch(() => {})
    .finally(() => {
      // console.log('请求结束')
      isRequesting.value = false
    })
}

watch(model, (val) => {
  if (!val) {
    return
  }

  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === options.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

const handleCheckAll = (val) => {
  indeterminate.value = false
  if (val) {
    model.value = options.value.map((_) => _.value)
  } else {
    model.value = []
  }
}
</script>

<style scoped lang="scss"></style>

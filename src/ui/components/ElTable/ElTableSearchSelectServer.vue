<template>
  <el-form-item-select-server
    v-model="model"
    :required="props.required"
    :label="props.label"
    :placeholder="props.placeholder"
    :prop="props.prop"
    :url="props.url"
    :field="props.field"
    :fieldLabel="props.fieldLabel"
    :fieldValue="props.fieldValue"
    :multiple="props.multiple"
    :collapseTags="props.collapseTags"
    :maxCollapseTags="props.maxCollapseTags"
    :collapseTagsTooltip="props.collapseTagsTooltip"
    class="table-search-item"
  />
</template>

<script setup lang="ts">
import { defineProps, defineModel } from 'vue'
import ElFormItemSelectServer from '@/ui/components/ElForm/ElFormItemSelectServer.vue'

type OptionStruct = {
  label: String
  value: String | Number
}

const model = defineModel()
const props = defineProps<{
  /** 是否必传 */
  required?: Boolean
  /** 支持直接输入国际化的key */
  label: String
  /** 支持直接输入国际化的key */
  placeholder?: String
  /** el-form 使用rules规则检查时用到 */
  prop?: String
  /** 请求地址, 比如 /user/roles */
  url: String
  /** 响应后options保存的字段 data.items */
  field: String
  /** 选项对应的文本 */
  fieldLabel: String
  /** 选项对应的值 */
  fieldValue: String
  /** 多选 */
  multiple?: Boolean
  /** 折叠显示 */
  collapseTags?: Boolean
  /** 多选多少个选项后开始折叠 */
  maxCollapseTags?: Number
  /** 多选折叠显示 */
  collapseTagsTooltip?: Boolean
}>()
</script>

<style src="./ElTableSearch.css" scoped />

<style scoped>
:deep(.el-select__selection) {
  flex-wrap: nowrap !important; /* 当元素超出容器宽度时不换行 */
  overflow-x: hidden !important; /*  超出部分隐藏  */
}
</style>

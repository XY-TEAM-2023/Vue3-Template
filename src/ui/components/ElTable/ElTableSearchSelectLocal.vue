<template>
  <el-form-item-select-local
    v-model="model"
    :required="props.required"
    :label="props.label"
    :placeholder="props.placeholder"
    :prop="props.prop"
    :options="props.options"
    :multiple="props.multiple"
    :collapse-tags="props.collapseTags"
    :readonly="props.readonly"
    class="table-search-item"
  />
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import ElFormItemSelectLocal from '@/ui/components/ElForm/ElFormItemSelectLocal.vue'

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
  /** 选项 */
  options: OptionStruct[]
  /** 多选 */
  multiple?: Boolean
  /** 合并选中 */
  collapseTags?: Boolean
  /** 是否只读 */
  readonly?: Boolean
}>()
</script>

<style src="./ElTableSearch.css" scoped />

<style scoped>
:deep(.el-select__selection) {
  flex-wrap: nowrap !important; /* 当元素超出容器宽度时不换行 */
  overflow-x: hidden !important; /*  超出部分隐藏  */
}
</style>

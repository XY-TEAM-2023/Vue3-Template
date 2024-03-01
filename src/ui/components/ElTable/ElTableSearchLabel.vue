<template>
  <el-form-item-label
    v-model="model"
    :required="props.required"
    :label="props.label"
    :defaultValue="props.defaultValue"
    :placeholder="props.placeholder"
    :prop="props.prop"
    :maxlength="props.maxlength"
    :readonly="props.readonly"
    :showWordLimit="props.showWordLimit"
    :rows="props.rows"
    class="table-search-item"
  />
</template>

<script setup>
import { defineProps, defineModel } from 'vue'
import ElFormItemLabel from '@/ui/components/ElForm/ElFormItemLabel.vue'

const model = defineModel()
const props = defineProps({
  /** 是否必传 */
  required: {
    type: Boolean,
    default: undefined,
  },
  /** 支持直接输入国际化的key */
  label: String,
  defaultValue: String,
  /** 支持直接输入国际化的key */
  placeholder: String,
  /** el-form 使用rules规则检查时用到 */
  prop: String,
  maxlength: Number,
  /** 是否只读 */
  readonly: Boolean,
  /** 是否显示字数限制 */
  showWordLimit: Boolean,
  /** 输入类型 */
  rows: {
    type: Number,
    default: 1,
  },
})
</script>

<style scoped lang="scss"></style>
<style src="./ElTableSearch.css" scoped />

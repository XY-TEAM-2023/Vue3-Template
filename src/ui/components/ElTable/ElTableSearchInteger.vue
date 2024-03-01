<template>
  <el-form-item-integer
    v-model="model"
    :required="props.required"
    :label="props.label"
    :placeholder="props.placeholder"
    :prop="props.prop"
    :min="props.min"
    :max="props.max"
    :readonly="props.readonly"
    class="table-search-item"
  />
</template>

<script setup>
import { defineProps, defineModel } from 'vue'
import ElFormItemInteger from '@/ui/components/ElForm/ElFormItemInteger.vue'

const model = defineModel()
const props = defineProps({
  /** 是否必传 */
  required: {
    type: Boolean,
    default: undefined,
  },
  /** 支持直接输入国际化的key */
  label: String,
  /** 支持直接输入国际化的key */
  placeholder: String,
  /** el-form 使用rules规则检查时用到 */
  prop: String,
  /** 最小值 */
  min: Number,
  /** 最大值 */
  max: Number,
  /** 是否只读 */
  readonly: Boolean,
})
</script>

<style scoped lang="scss"></style>
<style src="./ElTableSearch.css" scoped />

<template>
  <el-form-item-float
    v-model="model"
    :required="props.required"
    :label="props.label"
    :prop="props.prop"
    :min="props.min"
    :max="props.max"
    :readonly="props.readonly"
    :placeholder="props.placeholder"
    :format-decimal="props.formatDecimal"
    class="table-search-item"
  />
</template>

<script setup>
import { defineProps, defineModel } from 'vue'
import ElFormItemFloat from '@/ui/components/ElForm/ElFormItemFloat.vue'

const model = defineModel()
const props = defineProps({
  /** 是否必传 */
  required: {
    type: Boolean,
    default: undefined,
  },
  /** 支持直接输入国际化的key */
  label: String,
  /** 规则检查的prop */
  prop: String,
  /** 最小值 */
  min: Number,
  /** 最大值 */
  max: Number,
  /** 是否只读 */
  readonly: Boolean,
  /** 输入提示 */
  placeholder: String,
  /** 保留几位小数点, 默认不限制 */
  formatDecimal: Number,
})
</script>

<style scoped lang="scss"></style>
<style src="./ElTableSearch.css" scoped />

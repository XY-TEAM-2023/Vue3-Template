<template>
  <el-form-item :label="label" :required="required" :prop="props.prop">
    <el-input-float
      v-model="model"
      :min="props.min"
      :max="props.max"
      :clearable="true"
      :placeholder="props.placeholder"
      :formatDecimal="props.formatDecimal"
      style="width: 100%"
    />
  </el-form-item>
</template>

<script setup>
import { computed, defineProps, defineModel } from 'vue'
import { tryGetI18nText } from '@/utils'
import ElInputFloat from '@/ui/components/ElInput/ElInputFloat.vue'

const model = defineModel()
const props = defineProps({
  /** 是否必传 */
  required: Boolean,
  /** 支持直接输入国际化的key */
  label: String,
  /** 规则检查的prop */
  prop: String,
  /** 最小值 */
  min: Number,
  /** 最大值 */
  max: Number,
  /** 输入提示 */
  placeholder: String,
  /** 保留几位小数点, 默认不限制 */
  formatDecimal: Number,
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})
</script>

<style scoped lang="scss"></style>

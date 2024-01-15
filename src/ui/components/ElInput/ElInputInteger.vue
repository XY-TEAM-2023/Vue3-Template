<template>
  <el-input v-model="model" @input="handleInput" :min="min" :max="max" :placeholder="placeholder" :clearable="props.clearable"> </el-input>
</template>

<script setup>
import { computed, defineModel } from 'vue'
import { ElInput } from 'element-plus'
import { tryGetI18nText } from '@/utils'

const model = defineModel()
const props = defineProps({
  /** 最小值 */
  min: Number,
  /** 最大值 */
  max: Number,
  /** 是否可以清除 */
  clearable: Boolean,
  /** 输入提示，支持直接输入国际化的key */
  placeholder: String,
})

const placeholder = computed(() => {
  return tryGetI18nText(props.placeholder)
})

const handleInput = (value) => {
  // 允许小数点、数字和负号
  let processedValue = value.replace(/[^0-9-]+/g, '')
  processedValue = processedValue.replace(/-+/g, '-')

  if (processedValue === '-') {
    model.value = processedValue
    return
  }

  // 尝试将处理后的值转换为浮点数
  let numericValue = parseInt(processedValue)

  // 检查转换后的数值是否为NaN（不是一个数字），如果是，则重置为0
  if (isNaN(numericValue)) {
    numericValue = 0
  }

  // 应用最小值限制
  if (props.min !== undefined && numericValue < props.min) {
    processedValue = String(props.min)
  }

  // 应用最大值限制
  if (props.max !== undefined && numericValue > props.max) {
    processedValue = String(props.max)
  }

  // 检查并应用小数位数限制
  if (props.formatDecimal !== undefined) {
    const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${props.formatDecimal}})?`)
    processedValue = (processedValue.match(regex) || [])[0] || ''
  }

  model.value = processedValue
}
</script>

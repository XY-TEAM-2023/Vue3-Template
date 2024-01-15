<template>
  <el-input v-model="inputValue" @input="handleInput" :min="min" :max="max" :placeholder="placeholder" :clearable="props.clearable">
  </el-input>
</template>

<script setup>
import { ref } from 'vue'
import { ElInput } from 'element-plus'

const props = defineProps({
  modeValue: {
    type: String,
    default: '',
  },
  /** 最小值 */
  min: Number,
  /** 最大值 */
  max: Number,
  /** 是否可以清除 */
  clearable: Boolean,
  /** 输入提示 */
  placeholder: String,
  /** 保留几位小数点, 默认不限制 */
  formatDecimal: Number,
})

const inputValue = ref(props.modeValue)

const emit = defineEmits(['update:modelValue'])

const handleInput = (value) => {
  // 允许小数点、数字和负号
  let processedValue = value.replace(/[^0-9.-]/g, '')
  processedValue = processedValue.replace(/-+/g, '-')

  if (processedValue === '-') {
    inputValue.value = processedValue
    // 发出更新事件
    emit('update:modelValue', inputValue.value)
    return
  }

  // 尝试将处理后的值转换为浮点数
  let numericValue = parseFloat(processedValue)

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

  inputValue.value = processedValue

  // 发出更新事件
  emit('update:modelValue', inputValue.value)
}
</script>

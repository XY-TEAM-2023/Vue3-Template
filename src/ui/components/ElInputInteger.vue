<template>
  <el-input v-model="inputValue" @input="handleInput" :min="min" :max="max" :placeholder="placeholder"> </el-input>
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
})

const inputValue = ref(props.modeValue)

const emit = defineEmits(['update:modelValue'])

const handleInput = (value) => {
  inputValue.value = value.replace(/[^0-9-]+/g, '')
  if (props.min && parseInt(inputValue.value) < props.min) {
    inputValue.value = props.min
  }
  if (props.max && parseInt(inputValue.value) > props.max) {
    inputValue.value = props.max
  }

  emit('update:modelValue', inputValue.value)
}
</script>

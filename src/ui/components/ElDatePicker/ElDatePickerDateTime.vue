<!--  Form：输入整数  -->
<template>
  <el-date-picker
    v-model="displayValue"
    :format="props.format"
    :value-format="valueFormat"
    type="datetime"
    :placeholder="tryGetI18nText(props.placeholder)"
    @change="onChange"
  />
</template>

<script setup>
import { defineProps, defineModel, ref, watch } from 'vue'
import { tsToTimezoneDate } from '@/utils/timeUtil'
import { tryGetI18nText } from '@/utils'

const model = defineModel()
const props = defineProps({
  clearable: Boolean,
  placeholder: String,
  format: String,
  defaultTs: Number,
  valueFormat: String,
})

// 显示值
const displayValue = ref(tsToTimezoneDate(props.defaultTs))
// 最终值（临时）用于重置表单时，同步重置显示值
let finalValue = 0

/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [model],
  ([newModel], [oldModel]) => {
    if (newModel.value === undefined) {
      finalValue = undefined
      displayValue.value = []
    } else if (finalValue !== newModel.value) {
      finalValue = newModel.value
      displayValue.value = tsToTimezoneDate(finalValue)
    }
  },
  { deep: true }
)

const emits = defineEmits(['change'])

function onChange(val) {
  finalValue = val ? val.getTime() / 1000 : undefined
  model.value = finalValue
  emits('change', val)
}
</script>

<style scoped lang="scss"></style>

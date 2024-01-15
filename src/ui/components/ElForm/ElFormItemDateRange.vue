<template>
  <el-form-item :label="label" :required="required" :prop="props.prop">
    <el-date-picker-range
      v-model="model"
      :default-start-ts="props.defaultStartTs"
      :default-end-ts="props.defaultEndTs"
      :clearable="true"
      :format="props.format"
      @change="onChange"
      style="width: 100%"
    />
  </el-form-item>
</template>

<script setup>
import { computed, defineProps, defineModel } from 'vue'
import { tryGetI18nText } from '@/utils'
import ElDatePickerRange from '@/ui/components/ElDatePicker/ElDatePickerRange.vue'
import ElDatePickerDate from '@/ui/components/ElDatePicker/ElDatePickerDate.vue'

const model = defineModel()
const props = defineProps({
  /** 是否必传 */
  required: Boolean,
  /** 支持直接输入国际化的key */
  label: String,
  /** 规则检查的prop */
  prop: String,
  defaultStartTs: Number,
  defaultEndTs: Number,
  format: String,
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})

const emits = defineEmits(['change'])
function onChange(val) {
  console.log(model)
  emits('change', val)
}
</script>

<style scoped lang="scss"></style>

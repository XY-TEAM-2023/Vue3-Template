<template>
  <el-form-item :label="label" :required="required" :prop="props.prop">
    <el-date-picker-date-time
      v-model="model"
      :clearable="true"
      :placeholder="placeholder"
      :format="format"
      :default-ts="defaultTs"
      @change="onChange"
      style="width: 100%"
    />
  </el-form-item>
</template>

<script setup>
import { computed, defineProps, defineModel } from 'vue'
import { tryGetI18nText } from '@/utils'
import ElDatePickerDateTime from '@/ui/components/ElDatePicker/ElDatePickerDateTime.vue'
import ElDatePickerDate from '@/ui/components/ElDatePicker/ElDatePickerDate.vue'

const model = defineModel()
const props = defineProps({
  /** 是否必传 */
  required: Boolean,
  /** 支持直接输入国际化的key */
  label: String,
  /** 规则检查的prop */
  prop: String,
  placeholder: String,
  format: String,
  defaultTs: Number,
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})

const emits = defineEmits(['change'])
function onChange(val) {
  emits('change', val)
}
</script>

<style scoped lang="scss"></style>

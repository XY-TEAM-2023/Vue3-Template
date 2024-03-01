<template>
  <el-form-item-date-time
    v-model="model"
    :required="props.required"
    :label="props.label"
    :prop="props.prop"
    :placeholder="props.placeholder"
    :format="props.format"
    :default-ts="props.defaultTs"
    @change="onChange"
    class="table-search-item"
  />
</template>

<script setup>
import { defineProps, defineModel } from 'vue'
import ElFormItemDateTime from '@/ui/components/ElForm/ElFormItemDateTime.vue'

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
  placeholder: String,
  format: String,
  defaultTs: Number,
})

const emits = defineEmits(['change'])

function onChange(val) {
  emits('change', val)
}
</script>

<style scoped lang="scss"></style>
<style src="./ElTableSearch.css" scoped />

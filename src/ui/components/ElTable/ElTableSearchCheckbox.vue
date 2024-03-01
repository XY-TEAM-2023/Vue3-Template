<template>
  <el-form-item-checkbox v-model="model" :required="props.required" :label="props.label" :prop="props.prop" class="table-search-item" />
</template>

<script setup>
import { defineProps, defineModel } from 'vue'
import ElFormItemCheckbox from '@/ui/components/ElForm/ElFormItemCheckbox.vue'

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
})
</script>

<style src="./ElTableSearch.css" scoped />
<style scoped lang="scss"></style>

<!--  Form：输入文本  -->
<template>
  <el-input v-model="model" :placeholder="placeholder" :maxlength="props.maxlength" :clearable="props.clearable" style="width: 100%" />
</template>

<script setup>
import { computed, defineProps, defineModel } from 'vue'
import { tryGetI18nText } from '@/utils'

const model = defineModel()
const props = defineProps({
  /** 是否必传 */
  required: Boolean,
  /** 支持直接输入国际化的key */
  placeholder: String,
  /** el-form 使用rules规则检查时用到 */
  prop: String,
  maxlength: Number,
  clearable: Boolean,
})

const placeholder = computed(() => {
  return tryGetI18nText(props.placeholder)
})
</script>

<style scoped lang="scss"></style>

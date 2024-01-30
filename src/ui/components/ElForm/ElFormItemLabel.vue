<template>
  <el-form-item :label="label" :required="required" :prop="props.prop">
    <template v-if="props.readonly">
      {{ label }}
    </template>
    <template v-else>
      <el-input v-model="model" :placeholder="placeholder" :maxlength="props.maxlength" :clearable="true" style="width: 100%" />
    </template>
  </el-form-item>
</template>

<script setup>
import { computed, defineProps, defineModel } from 'vue'
import { tryGetI18nText } from '@/utils'

const model = defineModel()
const props = defineProps({
  /** 是否必传 */
  required: Boolean,
  /** 支持直接输入国际化的key */
  label: String,
  /** 支持直接输入国际化的key */
  placeholder: String,
  /** el-form 使用rules规则检查时用到 */
  prop: String,
  maxlength: Number,
  /** 是否只读 */
  readonly: Boolean,
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})
const placeholder = computed(() => {
  return tryGetI18nText(props.placeholder)
})
</script>

<style scoped lang="scss"></style>

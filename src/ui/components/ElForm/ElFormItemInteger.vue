<template>
  <el-form-item :label="label" :required="required" :prop="props.prop">
    <el-input-integer v-model="model" :placeholder="placeholder" :min="props.min" :max="props.max" :clearable="true" style="width: 100%" />
  </el-form-item>
</template>

<script setup>
import { computed, defineProps, defineModel } from 'vue'
import { tryGetI18nText } from '@/utils'
import ElInputInteger from '@/ui/components/ElInput/ElInputInteger.vue'

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
  /** 最小值 */
  min: Number,
  /** 最大值 */
  max: Number,
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})
</script>

<style scoped lang="scss"></style>

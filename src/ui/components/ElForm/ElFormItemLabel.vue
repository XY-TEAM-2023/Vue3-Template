<template>
  <el-form-item :label="label" :required="required" :prop="props.prop" class="unselect">
    <template v-if="props.readonly">
      {{ model }}
    </template>
    <template v-else>
      <el-input
        v-model="model"
        :placeholder="placeholder"
        :maxlength="props.maxlength"
        :show-word-limit="props.showWordLimit"
        :type="labelType"
        :clearable="true"
        :rows="props.rows"
        style="width: 100%"
      />
    </template>
  </el-form-item>
</template>

<script setup>
import { computed, defineProps, defineModel } from 'vue'
import { tryGetI18nText } from '@/utils'

const model = defineModel()
const props = defineProps({
  /** 是否必传 */
  required: {
    type: Boolean,
    default: undefined,
  },
  /** 支持直接输入国际化的key */
  label: String,
  defaultValue: String,
  /** 支持直接输入国际化的key */
  placeholder: String,
  /** el-form 使用rules规则检查时用到 */
  prop: String,
  maxlength: Number,
  /** 是否只读 */
  readonly: Boolean,
  /** 是否显示字数限制 */
  showWordLimit: Boolean,
  /** 输入类型 */
  rows: {
    type: Number,
    default: 1,
  },
})

const labelType = computed(() => {
  return props.rows > 1 ? 'textarea' : 'text'
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})
const placeholder = computed(() => {
  return tryGetI18nText(props.placeholder)
})
</script>

<style scoped lang="scss"></style>

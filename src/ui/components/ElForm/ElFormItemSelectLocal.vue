<!--  Form：输入文本  -->
<template>
  <el-form-item :label="label" :required="required" :prop="props.prop" class="unselect">
    <el-select-local
      v-model="model"
      :multiple="props.multiple"
      :collapse-tags="collapseTags"
      collapse-tags-tooltip
      :clearable="true"
      :options="options"
      :placeholder="placeholder"
      style="width: 100%; max-height: 32px"
      @change="onchange"
      :readonly="props.readonly"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { computed, defineProps, defineModel, ref, defineEmits } from 'vue'
import { tryGetI18nText } from '@/utils'
import ElSelectLocal from '@/ui/components/ElSelect/ElSelectLocal.vue'

type OptionStruct = {
  label: String
  value: String | Number
}

const model = defineModel()
const props = defineProps<{
  /** 是否必传 */
  required?: Boolean
  /** 支持直接输入国际化的key */
  label: String
  /** 支持直接输入国际化的key */
  placeholder?: String
  /** el-form 使用rules规则检查时用到 */
  prop?: String
  /** 选项 */
  options: OptionStruct[]
  /** 多选 */
  multiple?: Boolean
  /** 合并选中 */
  collapseTags?: Boolean
  /** 是否只读 */
  readonly?: Boolean
}>()

const collapseTags = computed(() => (props.collapseTags === undefined || props.collapseTags === null ? true : props.collapseTags))

const label = computed(() => {
  return tryGetI18nText(props.label)
})
const placeholder = computed(() => {
  return tryGetI18nText(props.placeholder)
})

const emit = defineEmits(['change'])

function onchange() {
  emit('change')
}
</script>

<style scoped lang="scss"></style>

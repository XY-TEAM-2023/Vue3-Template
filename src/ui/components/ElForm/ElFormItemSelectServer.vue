<template>
  <el-form-item :label="label" :required="props.required" :prop="props.prop" class="unselect">
    <el-select-server
      v-model="model"
      :multiple="props.multiple"
      :collapse-tags="props.collapseTags"
      :collapse-tags-tooltip="props.collapseTagsTooltip"
      :max-collapse-tags="props.maxCollapseTags"
      :url="props.url"
      :field="props.field"
      :field-label="props.fieldLabel"
      :field-value="props.fieldValue"
      :clearable="true"
      :placeholder="placeholder"
      style="width: 100%"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { computed, defineProps, defineModel } from 'vue'
import { tryGetI18nText } from '@/utils'
import ElSelectServer from '@/ui/components/ElSelect/ElSelectServer.vue'
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
  /** 请求地址, 比如 /user/roles */
  url: String
  /** 响应后options保存的字段 data.items */
  field: String
  /** 选项对应的文本 */
  fieldLabel: String
  /** 选项对应的值 */
  fieldValue: String
  /** 多选 */
  multiple?: Boolean
  /** 折叠显示 */
  collapseTags?: Boolean
  /** 多选多少个选项后开始折叠 */
  maxCollapseTags?: Number
  /** 多选折叠显示 */
  collapseTagsTooltip?: Boolean
}>()

const label = computed(() => {
  return tryGetI18nText(props.label)
})
const placeholder = computed(() => {
  return tryGetI18nText(props.placeholder)
})
</script>

<style scoped lang="scss"></style>

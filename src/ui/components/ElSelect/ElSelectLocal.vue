<!--  选项使用本地数据  -->
<template>
  <el-select v-model="model" :clearable="clearable" :placeholder="placeholder" style="width: 100%">
    <template v-for="item in options" :key="item.value">
      <el-option :label="item.label" :value="item.value" />
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { computed, defineProps, defineModel } from 'vue'
import { tryGetI18nText } from '@/utils'

type OptionStruct = {
  label: String
  value: String | Number
}

const model = defineModel()
const props = defineProps<{
  /** 支持直接输入国际化的key */
  placeholder?: String
  /** 是否可以清除 */
  clearable?: Boolean
  /** 选项 */
  options: OptionStruct[]
}>()

const placeholder = computed(() => {
  return tryGetI18nText(props.placeholder)
})
</script>

<style scoped lang="scss"></style>

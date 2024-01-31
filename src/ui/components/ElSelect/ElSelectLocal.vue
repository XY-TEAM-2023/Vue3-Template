<!--  选项使用本地数据  -->
<template>
  <el-select v-model="model" :multiple="props.multiple" :clearable="clearable" :placeholder="placeholder" style="width: 100%">
    <template #header v-if="props.multiple">
      <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll"> All </el-checkbox>
    </template>

    <template v-for="item in options" :key="item.value">
      <el-option :label="item.label" :value="item.value" />
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineModel, watch } from 'vue'
import { tryGetI18nText } from '@/utils'

type OptionStruct = {
  label: String
  value: String | Number
}

const checkAll = ref(false)
const model = defineModel()
const indeterminate = ref(false)
const props = defineProps<{
  /** 支持直接输入国际化的key */
  placeholder?: String
  /** 是否可以清除 */
  clearable?: Boolean
  /** 选项 */
  options: OptionStruct[]
  /** 多选 */
  multiple?: Boolean
}>()

watch(model, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === props.options.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

const handleCheckAll = (val) => {
  indeterminate.value = false
  if (val) {
    model.value = props.options.map((_) => _.value)
  } else {
    model.value = []
  }
}

const placeholder = computed(() => {
  return tryGetI18nText(props.placeholder)
})
</script>

<style scoped lang="scss"></style>

<!--  选项使用本地数据  -->
<template>
  <el-select
    v-model="model"
    :multiple="props.multiple"
    :clearable="clearable"
    :placeholder="placeholder"
    style="width: 100%"
    @change="onchange"
    :class="props.readonly ? 'disabled-component' : ''"
  >
    <template #header v-if="props.multiple">
      <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll"> All</el-checkbox>
    </template>

    <template v-for="item in options" :key="item.value">
      <el-option :label="item.label" :value="item.value" />
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineModel, watch, defineEmits } from 'vue'
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
  readonly?: Boolean
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

const emit = defineEmits(['change'])

function onchange() {
  emit('change')
}
</script>

<style scoped lang="scss">
.disabled-component {
  /* 禁止接受鼠标事件 */
  pointer-events: none;

  :deep(.el-select__suffix) {
    display: none;
  }

  :deep(.el-select__wrapper) {
    box-shadow: none;
  }

  :deep(.el-select__wrapper) {
    padding: 0 0 0 0;
  }
}
</style>

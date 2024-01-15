<template>
  <el-form-item :label="label" :required="required" :prop="props.prop">
    <el-checkbox v-model="model" style="width: 100%"></el-checkbox>
  </el-form-item>
</template>

<script setup>
import { computed, defineProps, defineModel, watch, ref } from 'vue'
import { tryGetI18nText } from '@/utils'

const model = defineModel()
const props = defineProps({
  /** 是否必传 */
  required: Boolean,
  /** 支持直接输入国际化的key */
  label: String,
  /** 规则检查的prop */
  prop: String,
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})

/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [model],
  ([newModel], [oldModel]) => {
    console.log('newModel', newModel)
    if (newModel.value === undefined) {
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss"></style>

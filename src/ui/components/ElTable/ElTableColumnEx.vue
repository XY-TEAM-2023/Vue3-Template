<template>
  <el-table-column :label="label" :width="props.width" :align="props.align" :show-overflow-tooltip="true" v-bind="$attrs">
    <template #default="scope">
      <slot v-bind="scope"></slot>
    </template>
  </el-table-column>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { tryGetI18nText } from '@/utils'

const props = defineProps({
  /** 表格标题，支持国际化Key */
  label: String,
  /** 显示的属性 */
  prop: String,
  /** 表格宽度 */
  width: String,
  /** 对齐方式：left/center/right */
  align: String,
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})
</script>

<style scoped lang="scss">
.input-label {
}

.input-label-edit {
}

.input-label-edit:hover {
  color: #007aff;
  text-underline: #007aff;
  cursor: pointer; /* 修改鼠标样式为手型 */
}
</style>

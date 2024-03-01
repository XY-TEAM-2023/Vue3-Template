<template>
  <el-table-column
    v-if="showColumn(props.prop)"
    :label="label"
    :prop="props.prop"
    :width="props.width"
    :align="props.align"
    :show-overflow-tooltip="true"
    :sortable="sortable"
    v-bind="$attrs"
  >
    <template v-if="$slots.default" #default="scope">
      <slot v-bind="scope"></slot>
    </template>
  </el-table-column>
</template>

<script setup>
import { computed, defineProps, ref, onMounted, inject } from 'vue'
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
  /** 是否开启排序 */
  sortable: {
    type: Boolean,
    default: true,
  },
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})

const sortable = computed(() => {
  return props.sortable && props.prop !== undefined
})

const showColumn = inject('showColumnFun')
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

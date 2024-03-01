<template>
  <el-table-column
    v-if="showColumn(props.prop)"
    :label="label"
    :prop="props.prop"
    :width="props.width"
    :align="props.align"
    :show-overflow-tooltip="true"
    :sortable="sortable"
  >
    <template #default="scope">
      <el-switch
        v-loading="scope.row.isRequesting"
        :disabled="!canEdit"
        v-model="scope.row[props.prop]"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @click="
          () => {
            onChange(scope.$index, scope.row)
          }
        "
      >
      </el-switch>
    </template>
  </el-table-column>
</template>

const showColumn = inject('showColumnFun')
<script setup>
import { computed, defineProps, inject, ref } from 'vue'
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
  /** 是否可以编辑，为true时，点击内容会弹出修改窗口 */
  canEdit: {
    type: Boolean,
    default: false,
  },
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

const emit = defineEmits(['edit'])

function onChange(index, row) {
  if (!props.canEdit) {
    return
  }
  if (row.isRequesting) {
    return
  }
  row.isRequesting = true

  if (props.canEdit) {
    const cancelCb = () => {
      row.isRequesting = false
      row[props.prop] = !row[props.prop]
    }

    const closeCb = () => {
      row.isRequesting = false
    }

    emit('edit', index, row, row[props.prop], cancelCb, closeCb)
  }
}

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

<template>
  <el-table-column :label="$t(props.label)" :width="props.width" :align="props.align" :show-overflow-tooltip="true">
    <template #default="scope">
      <span class="input-label" :class="{ 'input-label-edit': canEdit }" @click="onClick(scope.$index, scope.row)">
        {{ scope.row[props.prop] ? scope.row[props.prop] : props.emptyLabel }}
      </span>
    </template>
  </el-table-column>
</template>

<script setup>
import { defineProps } from 'vue'
import dialog from '@/ui/components/DIalog/Dialog'

const props = defineProps({
  label: String,
  prop: String,
  width: String,
  // left/center/right
  align: String,
  // 没有值怎么显示
  emptyLabel: {
    type: String,
    default: '-----',
  },
  canEdit: {
    type: Boolean,
    default: true,
  },
  editTitle: String,
  editWidth: {
    type: String,
    default: '300',
  },
  editPlaceholder: String,
  editMaxLength: String,
  editShowWordLimit: Boolean,
  editClearable: Boolean,
})

function onClick(index, row) {
  if (props.canEdit) {
    dialog.input({
      title: props.editTitle ? props.editTitle : props.label,
      width: props.editWidth,
      defaultValue: row[props.prop],
      placeholder: props.editPlaceholder ? props.editPlaceholder : '',
      maxLength: props.editMaxLength,
      showWordLimit: props.editShowWordLimit,
      clearable: props.editClearable,
      onSubmit: (newValue, cancelCb, closeCb) => {
        onSubmitHandler(index, row, newValue, cancelCb, closeCb)
      },
    })
  }
}

const emit = defineEmits(['edit'])
function onSubmitHandler(index, row, newValue, cancelCb, closeCb) {
  emit('edit', index, row, newValue, cancelCb, closeCb)
}
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

<template>
  <el-table-column :label="label" :width="props.width" :align="props.align" :show-overflow-tooltip="true">
    <template #default="scope">
      <span class="input-label" :class="{ 'input-label-edit': canEdit }" @click="onClick(scope.$index, scope.row)">
        {{ formatNumberAsMoney(scope.row[props.prop], props.showFloat) }}
      </span>
    </template>
  </el-table-column>
</template>

<script setup>
import { computed, defineProps, getCurrentInstance } from 'vue'
import dialog from '@/ui/components/DIalog/Dialog'
import { formatNumberAsMoney, getI18nText, tryGetI18nText } from '@/utils'

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
  /** 编辑窗口的标题 */
  editTitle: String,
  /** 编辑窗口的宽度 */
  editWidth: {
    type: String,
    default: '300',
  },
  /** 编辑窗口输入提示 */
  editPlaceholder: String,
  /** 编辑窗口输入最大长度 */
  editMaxLength: String,
  /** 编辑窗口输入显示最大长度限制 */
  editShowWordLimit: Boolean,
  /** 编辑窗口输入是否可以清除 */
  editClearable: {
    type: Boolean,
    default: true,
  },
  showFloat: Boolean,
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})

const emit = defineEmits(['edit', 'click'])
const instance = getCurrentInstance()

function onClick(index, row) {
  if (instance.vnode.props.onEdit && props.canEdit) {
    dialog.inputFloat({
      title: props.editTitle ? props.editTitle : getI18nText('app.editDialogTitle', { title: label.value }),
      width: props.editWidth,
      defaultValue: row[props.prop],
      placeholder: props.editPlaceholder ? props.editPlaceholder : '',
      clearable: props.editClearable,
      onSubmit: (newValue, cancelCb, closeCb) => {
        emit('edit', index, row, newValue, cancelCb, closeCb)
      },
    })
  } else if (instance.vnode.props.onClick) {
    emit('click', index, row)
  }
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

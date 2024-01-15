<template>
  <el-table-column :label="label" :width="props.width" :align="props.align" :show-overflow-tooltip="true">
    <template #default="scope">
      <el-switch
        v-loading="isRequesting"
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

<script setup>
import { computed, defineProps, ref } from 'vue'
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
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})

const emit = defineEmits(['edit'])

const isRequesting = ref(false)

function onChange(index, row) {
  if (!props.canEdit) {
    return
  }
  if (isRequesting.value) {
    return
  }
  isRequesting.value = true

  if (props.canEdit) {
    const cancelCb = () => {
      isRequesting.value = false
      row[props.prop] = !row[props.prop]
    }

    const closeCb = () => {
      isRequesting.value = false
    }

    emit('edit', index, row, row[props.prop], cancelCb, closeCb)
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

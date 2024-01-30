<template>
  <el-table-column :label="label" :width="props.width" :align="props.align" :show-overflow-tooltip="true">
    <template #default="scope">
      <span class="input-label" :class="{ 'input-label-edit': canJump }" @click="onClick(scope.$index, scope.row)">
        <template v-if="scope.row[props.prop] === null || scope.row[props.prop] === undefined || scope.row[props.prop] === ''">
          {{ emptyLabel }}
        </template>
        <template v-else>
          {{ scope.row[props.prop] }}
        </template>
      </span>
    </template>
  </el-table-column>
</template>

<script setup>
import { computed, defineProps, getCurrentInstance } from 'vue'
import { getI18nText, tryGetI18nText } from '@/utils'

const props = defineProps({
  /** 表格标题，支持国际化Key */
  label: String,
  /** 显示的属性 */
  prop: String,
  /** 表格宽度 */
  width: String,
  /** 对齐方式：left/center/right */
  align: String,
  canJump: {
    type: Boolean,
    default: true,
  },
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})

const emptyLabel = computed(() => {
  return tryGetI18nText(props.emptyLabel)
})

function onClick(index, row) {
  let url = row[props.prop]
  if (!url.startsWith('http')) {
    url = 'http://' + url
  }
  window.open(url, '_blank')
}
</script>

<style scoped lang="scss">
.input-label {
  //display: flex;
}

.input-label-edit {
}

.input-label-edit:hover {
  color: #007aff;
  text-underline: #007aff;
  cursor: pointer; /* 修改鼠标样式为手型 */
}
</style>

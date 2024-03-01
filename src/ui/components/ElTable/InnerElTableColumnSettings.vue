<template>
  <el-button @click="displayChangeColumns = true" plain :icon="Setting" class="btn-fields" />

  <el-dialog v-model="displayChangeColumns" title="列显示设置" width="580" :close-on-click-modal="false">
    <div style="display: flex">
      <el-transfer v-model="hideColumns" :data="columnOptions" :titles="['显示字段', '隐藏字段']" />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="displayChangeColumns = false">
          {{ tryGetI18nText('com.btnCancel') }}
        </el-button>
        <el-button type="primary" @click="onSaveChange">
          {{ tryGetI18nText('com.btnOk') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { inject, ref } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { tryGetI18nText } from '@/utils'

/** 设置字段是否显示对黄框 */
const displayChangeColumns = ref(false)

/** 字段列表 */
const columnOptions = ref([
  // { label: 'test', key: '1', disabled: false },
])

/** 隐藏中的列 */
const hideColumns = ref([])

/** 初始化隐藏中的字段 */
function initHideColumns(columns) {
  hideColumns.value = columns
}

/** 初始化可以配置的列表 */
function initColumnOptions(options) {
  columnOptions.value = options
}

/** 保存隐藏中的列 */
const saveHideColumns = inject('saveHideColumns')

function onSaveChange() {
  saveHideColumns(hideColumns.value)
  displayChangeColumns.value = false
}

defineExpose({
  initHideColumns,
  initColumnOptions,
})
</script>

<style scoped lang="scss">
.btn-fields {
  width: 32px;
  font-size: 18px;
  margin-right: 8px;
  //margin-left: auto;
}
</style>

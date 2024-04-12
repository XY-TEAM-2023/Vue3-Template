<template>
  <el-button @click="onShow">
    {{ tryGetI18nText('DemandView.setFields') }}
  </el-button>

  <el-dialog v-model="dialogVisible" :title="tryGetI18nText('DemandView.setFields')" width="280" :close-on-click-modal="false">
    <fields-create @refresh-cb="requestSearch" />

    <el-scrollbar style="width: 100%; height: 250px; margin-top: 6px">
      <el-tree
        ref="treeRef"
        v-loading="isRequesting"
        style="width: 100%; margin-top: 6px"
        class="filter-tree"
        :data="tableData"
        :props="defaultProps"
        show-checkbox
        node-key="field"
        :default-checked-keys="props.selected"
        :filter-node-method="filterNode"
      />
    </el-scrollbar>

    <template #footer>
      <el-button type="danger" @click="dialogVisible = false">
        {{ tryGetI18nText('com.btnCancel') }}
      </el-button>

      <el-button type="primary" @click="onBtnSave">
        {{ tryGetI18nText('com.btnSubmit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, defineModel, defineProps, defineEmits } from 'vue'
import { ElTree } from 'element-plus'
import { tryGetI18nText } from '@/utils'
import { http_post } from '@/axios'
import FieldsCreate from '../Plan/FieldsCreate.vue'

const props = defineProps({
  plan_id: Number,
  selected: Array,
})

const dialogVisible = ref(false)
const treeRef = ref(null)

const defaultProps = {
  label: 'field',
  children: 'children',
}

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}

const tableData = ref([])

function onShow() {
  console.log(props.selected)
  dialogVisible.value = true
  requestSearch()
}

const isRequesting = ref(false)

/** 搜索 */
function requestSearch() {
  if (isRequesting.value) {
    return
  }
  isRequesting.value = true
  http_post('/api/admin/demand/field/list', { plan_id: props.plan_id }, false)
    .then((response) => {
      tableData.value = response.result
    })
    .catch(() => {})
    .finally(() => {
      isRequesting.value = false
    })
}

/** 作为子组件时，定义有什么事件 */
const emit = defineEmits(['refresh-cb'])

function onBtnSave() {
  const nodes = treeRef.value.getCheckedNodes()
  const ids = []
  nodes.forEach((item) => {
    ids.push(item.id)
  })

  http_post('/api/admin/demand/page/plan/fields/set', { plan_id: props.plan_id, field_ids: ids }, false)
    .then((response) => {
      dialogVisible.value = false
      emit('refresh-cb')
    })
    .catch(() => {})
    .finally(() => {
      isRequesting.value = false
    })
}
</script>

<style scoped lang="scss">
:deep(.el-tree-node__expand-icon) {
  display: none;
}
</style>

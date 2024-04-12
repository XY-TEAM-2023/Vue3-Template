<template>
  <el-table-ex
      :temp="props.plan_id"
      :data-table='tableData'
      :use-fold="true"
      v-loading='isRequestingSearch'
      :show-pagination='false'
      :is-small-pagination='true'
      :display-column-settings="false"
      size="small"
  >
    <template #header>
      {{ tryGetI18nText('DemandView.planFields') }}
    </template>

    <!--  左侧按钮  -->
    <template #operations>
      <fields-select :plan_id="props.plan_id" :selected="selectedKeys" @refresh-cb="requestFields"/>
    </template>

    <!--  右侧快捷搜索  -->
    <template #quickSearch>

    </template>

    <el-table-column-label label='数据简称' prop='field' align='center' can-edit @edit="tableEvents.onEditField"
                           width="200"/>
    <el-table-column-switch label='支持搜索' prop='can_search' align='center' can-edit size="small" width="150"
                            @edit="tableEvents.onEditCanSearch"/>
    <el-table-column-label label='数据来源' prop='desc' align='left' can-edit @edit="tableEvents.onEditDesc"/>
    <el-table-column-ex width="100" align="center">
      <template #default="scope">
        <el-button type="danger" size="small" @click="onBtnDelete(scope.row)">
          {{ tryGetI18nText('com.btnDelete') }}
        </el-button>
      </template>
    </el-table-column-ex>
  </el-table-ex>
</template>


<script setup>
import {defineExpose, defineProps, reactive, ref, onMounted} from 'vue'
import {http_get, http_post} from '@/axios'
import {useAppStore} from '@/stores/app'
import ElTableEx from '@/ui/components/ElTable/ElTableEx.vue'
import ElTableColumnLabel from '@/ui/components/ElTable/ElTableColumnLabel.vue'
import ElTableColumnInteger from '@/ui/components/ElTable/ElTableColumnInteger.vue'
import ElTableColumnFloat from '@/ui/components/ElTable/ElTableColumnFloat.vue'
import ElTableColumnMoney from '@/ui/components/ElTable/ElTableColumnMoney.vue'
import ElTableColumnSwitch from '@/ui/components/ElTable/ElTableColumnSwitch.vue'
import ElTableColumnTs from '@/ui/components/ElTable/ElTableColumnTs.vue'
import ElTableColumnEx from '@/ui/components/ElTable/ElTableColumnEx.vue'
import ElTableColumnLink from '@/ui/components/ElTable/ElTableColumnLink.vue'
import ElTableSearchLabel from '@/ui/components/ElTable/ElTableSearchLabel.vue'
import ElTableSearchInteger from '@/ui/components/ElTable/ElTableSearchInteger.vue'
import ElTableSearchSelectLocal from '@/ui/components/ElTable/ElTableSearchSelectLocal.vue'
import ElTableSearchSelectServer from '@/ui/components/ElTable/ElTableSearchSelectServer.vue'
import ElTableSearchFloat from '@/ui/components/ElTable/ElTableSearchFloat.vue'
import ElTableSearchCheckbox from '@/ui/components/ElTable/ElTableSearchCheckbox.vue'
import ElTableSearchDateRange from '@/ui/components/ElTable/ElTableSearchDateRange.vue'
import ElTableSearchDateTime from '@/ui/components/ElTable/ElTableSearchDateTime.vue'
import ElTableSearchDate from '@/ui/components/ElTable/ElTableSearchDate.vue'
import ElCardEx from "@/ui/components/ElCardEx.vue";
import {tryGetI18nText} from "@/utils";
import Dialog from "@/ui/components/DIalog/Dialog";
import FieldsSelect from "../Plan/FieldsSelect.vue";

const appStore = useAppStore()

const props = defineProps({
  plan_id: {
    type: Number,
  },
})
defineExpose({requestFields})


/** 是否正在搜索中 */
const isRequestingSearch = ref(false)
/** 表格显示的数据 */
const tableData = ref([])
const selectedKeys = ref([])

/** 初始化字段 */
function requestFields() {
  if (isRequestingSearch.value) {
    return
  }
  isRequestingSearch.value = true
  http_post('/api/admin/demand/page/plan/fields', {plan_id: props.plan_id}, false)
      .then((response) => {
        const fields = response.result

        let keys = []
        fields.forEach(item => {
          keys.push(item.field)
        })
        selectedKeys.value = keys
        tableData.value = fields
      })
      .catch(() => {
      })
      .finally(() => {
        isRequestingSearch.value = false
      })
}

function onBtnDelete(row) {
  if (row.isDeleting) {
    return
  }
  row.isDeleting = true
  Dialog.tip({
    content: tryGetI18nText('DemandView.deleteFieldTip'),
    width: 300,
    displayCancelBtn: true,
    onClose: () => {
      row.isDeleting = false
    },
    onSubmit: () => {
      http_post('/api/admin/demand/page/plan/fields/delete', {plan_id: props.plan_id, field_id: row.id}, true)
          .then(() => {
            requestFields()
          })
          .catch(() => {
          })
          .finally(() => {
            row.isDeleting = false
          })
    },
  })
}


/** 表格相关事件 */
const tableEvents = {

  /** 修改字段名 */
  onEditField: (index, row, newValue, cancelCb, closeCb) => {
    http_post('/api/admin/demand/field/edit/name', {id: row.id, field: newValue}, true)
        .then(() => {
          requestFields()
          closeCb()
        })
        .catch(() => {
          cancelCb()
        })
  },
  /** 修改字段解释 */
  onEditDesc: (index, row, newValue, cancelCb, closeCb) => {
    http_post('/api/admin/demand/field/edit/desc', {id: row.id, desc: newValue}, true)
        .then(() => {
          requestFields()
          closeCb()
        })
        .catch(() => {
          cancelCb()
        })
  },
  /** 修改业务逻辑 */
  onEditCall: (index, row, newValue, cancelCb, closeCb) => {
    http_post('/demand/edit/call', {id: row.id, call: newValue}, true)
        .then(() => {
          requestFields()
          closeCb()
        })
        .catch(() => {
          cancelCb()
        })
  },
  /** 修改字段是否可以搜索 */
  onEditCanSearch: (index, row, newValue, cancelCb, closeCb) => {
    http_post('/api/admin/demand/page/plan/fields/can_search',
        {plan_id: props.plan_id, field_id: row.id, can_search: newValue}, true)
        .then(() => {
          requestFields()
          closeCb()
        })
        .catch(() => {
          cancelCb()
        })
  },
}

</script>
<template>
  <el-button type="primary" @click="onCreate">创建</el-button>

  <el-table-ex
    :data="tableData"
    v-loading="isRequestingSearch"
    :show-pagination="false"
    :is-small-pagination="true"
    style="margin-top: 10px"
  >
    <el-table-column-index label="com.index" width="80" align="center" />
    <el-table-column-integer label="品牌Id" prop="id" align="center" />
    <el-table-column-label label="品牌名" prop="name" align="center" />
    <el-table-column-link label="入口站点" prop="portal" align="center" can-edit />
    <el-table-column-ex label="操作" align="center">
      <template #default="scope">
        <el-button type="primary" size="small">...</el-button>
      </template>
    </el-table-column-ex>
  </el-table-ex>

  <el-dialog v-model="createBrand.display" title="Tips" width="30%">
    <el-form-ex>
      <el-form-item-label label="品牌名" v-model="createBrand.brandName" />
      <el-form-item-label label="入口站点" v-model="createBrand.brandPortal" />
    </el-form-ex>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createBrand.display = false">
          {{ $t('com.btnCancel') }}
        </el-button>

        <el-button v-loading="createBrand.isSubmitting" type="primary" @click="createBrand.onSubmit">
          {{ $t('com.btnSubmit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ElCardEx from '@/ui/components/ElCardEx.vue'
import ElFormItemLabel from '@/ui/components/ElForm/ElFormItemLabel.vue'
import ElFormItemInteger from '@/ui/components/ElForm/ElFormItemInteger.vue'
import ElFormItemSelectLocal from '@/ui/components/ElForm/ElFormItemSelectLocal.vue'
import ElFormItemSelectServer from '@/ui/components/ElForm/ElFormItemSelectServer.vue'
import ElFormItemFloat from '@/ui/components/ElForm/ElFormItemFloat.vue'
import ElFormItemCheckbox from '@/ui/components/ElForm/ElFormItemCheckbox.vue'
import ElFormItemDateRange from '@/ui/components/ElForm/ElFormItemDateRange.vue'
import ElFormItemDateTime from '@/ui/components/ElForm/ElFormItemDateTime.vue'
import ElFormItemDate from '@/ui/components/ElForm/ElFormItemDate.vue'
import { http_get, http_post } from '@/axios'
import { useAppStore } from '@/stores/app'
import { getDefaultPageSize, setDefaultPageSize } from '@/utils'
import ElTableEx from '@/ui/components/ElTableEx.vue'
import ElTableColumnLabel from '@/ui/components/ElTable/ElTableColumnLabel.vue'
import ElTableColumnInteger from '@/ui/components/ElTable/ElTableColumnInteger.vue'
import ElTableColumnFloat from '@/ui/components/ElTable/ElTableColumnFloat.vue'
import ElTableColumnMoney from '@/ui/components/ElTable/ElTableColumnMoney.vue'
import ElTableColumnSwitch from '@/ui/components/ElTable/ElTableColumnSwitch.vue'
import ElTableColumnTimestamp from '@/ui/components/ElTable/ElTableColumnTimestamp.vue'
import ElTableColumnIndex from '@/ui/components/ElTable/ElTableColumnIndex.vue'
import ElTableColumnEx from '@/ui/components/ElTable/ElTableColumnEx.vue'
import ElTableColumnLink from '@/ui/components/ElTable/ElTableColumnLink.vue'
import Dialog from '@/ui/components/DIalog/Dialog'
import ElFormEx from '@/ui/components/ElForm/ElFormEx.vue'

const appStore = useAppStore()

/** 搜索Form对象 */
const searchDataRef = ref(null)
/** 搜索数据 */
const searchData = ref({})

function onResetSearch() {
  searchDataRef.value.resetFields()
}

/** 是否正在搜索中 */
const isRequestingSearch = ref(false)
/** 表格显示的数据 */
const tableData = ref([])

/** 分页查询数据 */
const searchPageData = ref({
  page: 1,
  page_size: getDefaultPageSize('/api/admin/brand/list'),
  total: 0,
})

/** 搜索 */
function requestSearch() {
  if (isRequestingSearch.value) {
    return
  }
  isRequestingSearch.value = true
  http_post('/api/admin/brand/list', { ...searchData.value }, false)
    .then((response) => {
      tableData.value = response.brands
      // searchPageData.value.total = response.total
    })
    .catch(() => {})
    .finally(() => {
      isRequestingSearch.value = false
    })
}
requestSearch()

const createBrand = ref({
  display: false,
  brandName: '',
  brandPortal: '',
  isSubmitting: false,
  onSubmit: () => {},
})

function onCreate() {
  createBrand.value.brandName = ''
  createBrand.value.brandPortal = ''
  createBrand.value.display = true
  createBrand.value.isSubmitting = false
  createBrand.value.onSubmit = () => {
    if (createBrand.value.isSubmitting) {
      return
    }
    createBrand.value.isSubmitting = true

    http_post('/api/admin/brand/create', { name: createBrand.value.brandName, portal: createBrand.value.brandPortal })
      .then(() => {
        requestSearch()
        createBrand.value.display = false
      })
      .catch(() => {})
      .finally(() => {
        createBrand.value.isSubmitting = false
      })
  }
}

/** 表格相关事件 */
const tableEvents = {
  /** 修改入口站点 */
  onEditPortal: (index, row, newValue, cancelCb, closeCb) => {
    http_post('/xxxxxxx', { id: row.id, portal: newValue })
      .then(() => {
        requestSearch()
        closeCb()
      })
      .catch(() => {
        cancelCb()
      })
  },
}
</script>

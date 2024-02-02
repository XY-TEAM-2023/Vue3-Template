<template>
  <el-card-ex :use-fold="true" shadow="never">
    <template #header> {{ $t('app.searchParamsTitle') }} </template>
    <el-form ref="searchDataRef" :model="searchData" label-position="top">
      <el-row :gutter="24">
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-select-local
            label="PlayerLoginRecordView.brand"
            v-model="searchData.search_brands"
            prop="search_brands"
            v-loading="requestingBrands"
            :options="brandOptions"
            :multiple="true"
          />
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-integer
            label="PlayerLoginRecordView.playerId"
            v-model="searchData.id"
            prop="id"
            :placeholder="null"
            :max="null"
            clearable
          />
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-label
            label="PlayerLoginRecordView.playerAccount"
            v-model="searchData.account"
            prop="account"
            :placeholder="null"
            :maxlength="null"
            clearable
          />
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div style="display: flex; margin-left: auto">
        <el-button type="warning" @click="onResetSearch" style="width: 100px">
          {{ $t('com.btnReset') }}
        </el-button>
        <el-button type="primary" @click="onSearch" style="width: 100px">
          {{ $t('com.btnSearch') }}
        </el-button>
      </div>
    </template>
  </el-card-ex>
  <el-card-ex :use-fold="false" shadow="never" style="margin-top: 10px">
    <template #header> {{ $t('app.searchResultTitle') }} </template>

    <el-table-ex
      :data="tableData"
      v-loading="isRequestingSearch"
      :show-pagination="true"
      :is-small-pagination="true"
      :current-page="searchPageData.page"
      :page-size="searchPageData.page_size"
      :page-sizes="appStore.pageSizes"
      :total="searchPageData.total"
      @size-change="onPageNumChange"
      @current-change="onPageChange"
    >
      <el-table-column-index label="com.index" width="100" align="center" />
      <el-table-column-integer label="PlayerLoginRecordView.recordId" prop="id" align="center" />
      <el-table-column-label label="PlayerLoginRecordView.brand" prop="brand" align="center" />
      <el-table-column-integer label="PlayerLoginRecordView.playerId" prop="player_id" align="center" />
      <el-table-column-label label="PlayerLoginRecordView.playerAccount" prop="account" align="center" />
      <el-table-column-timestamp label="PlayerLoginRecordView.loginTime" prop="ts" align="center" />
      <el-table-column-label label="PlayerLoginRecordView.loginIp" prop="ip" align="center" />
    </el-table-ex>
  </el-card-ex>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
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
import { getBrandOptions, getDefaultPageSize, setDefaultPageSize } from '@/utils'
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

const appStore = useAppStore()

onMounted(() => {
  requestBrands()
})
const requestingBrands = ref(false)
const brandOptions = ref([])
function requestBrands() {
  requestingBrands.value = true
  getBrandOptions()
    .then(({ options, selectAll }) => {
      brandOptions.value.push(...options)
      searchData.value.search_brands.push(...selectAll)
    })
    .catch(() => {
      // setTimeout(requestBrands, 1000)
    })
    .finally(() => {
      requestingBrands.value = false
    })
}

/** 搜索Form对象 */
const searchDataRef = ref(null)
/** 搜索数据 */
const searchData = ref({
  /** 玩家ID */
  id: undefined,
  /** 玩家账号 */
  account: undefined,
  search_brands: [],
})

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
  page_size: getDefaultPageSize('/api/admin/player/record/login'),
  total: 0,
})

/** 搜索 */
function requestSearch() {
  if (isRequestingSearch.value) {
    return
  }
  isRequestingSearch.value = true
  http_post('/api/admin/player/record/login', { ...searchData.value, ...searchPageData.value }, false)
    .then((response) => {
      tableData.value = response.records
      searchPageData.value.total = response.total
    })
    .catch(() => {})
    .finally(() => {
      isRequestingSearch.value = false
    })
}

/** 修改每页显示数量 */
function onPageNumChange(value) {
  searchPageData.value.page_size = value
  setDefaultPageSize('/api/admin/player/record/login', value)
  onSearch()
}

/** 搜索按钮事件 */
function onSearch() {
  searchPageData.value.page = 1
  requestSearch()
}

/** 切换页面 */
function onPageChange(value) {
  searchPageData.value.page = value
  requestSearch()
}

/** 表格相关事件 */
const tableEvents = {}
</script>

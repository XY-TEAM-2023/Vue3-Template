<template>
  <el-card-ex :use-fold="true" shadow="never">
    <template #header> {{ $t('app.searchParamsTitle') }} </template>
    <el-form ref="searchDataRef" :model="searchData" label-position="left">
      <el-row :gutter="24">
        <el-col>
          <el-form-item-select-local
            label="PlayerGlobalMailView.brand"
            v-model="searchData.brands"
            v-loading="requestingBrands"
            prop="brands"
            :options="brandOptions"
            :multiple="true"
            :collapseTags="false"
          />
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div style="display: flex; margin-left: auto">
        <el-button type="warning" @click="onResetSearch" style="width: 100px"> {{ $t('com.btnReset') }} </el-button>
        <el-button type="primary" @click="requestSearch" style="width: 100px"> {{ $t('com.btnSearch') }} </el-button>
      </div>
    </template>
  </el-card-ex>
  <el-card-ex :use-fold="false" shadow="never" style="margin-top: 10px">
    <template #header> {{ $t('app.searchResultTitle') }} </template>

    <el-button type="primary" size="default" @click="onSendGlobalMail">
      {{ $t('PlayerGlobalMailView.sendBtn') }}
    </el-button>

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
      style="margin-top: 10px"
    >
      <el-table-column-integer label="PlayerGlobalMailView.mailId" prop="id" align="center" width="100" />
      <el-table-column-label label="PlayerGlobalMailView.brand" prop="brand" align="center" width="120" />
      <el-table-column-label label="PlayerGlobalMailView.title" prop="title" align="center" width="300" />
      <el-table-column-label label="PlayerGlobalMailView.content" prop="content" align="center" can-edit @click="onDisplayContent" />
      <el-table-column-label label="PlayerGlobalMailView.operator" prop="operator" align="center" width="100" />
      <el-table-column-timestamp label="PlayerGlobalMailView.sendTime" prop="ts" align="center" width="160" />
    </el-table-ex>
  </el-card-ex>

  <el-dialog v-model="sendGlobalMail.display" :title="$t('PlayerGlobalMailView.sendBtn')" width="40%" :close-on-click-modal="false">
    <el-form-ex label-position="left">
      <el-form-item-select-local
        label="PlayerGlobalMailView.brand"
        v-model="sendGlobalMail.data.brands"
        v-loading="requestingBrands"
        :options="brandOptions"
        :multiple="true"
        :collapseTags="false"
      />
      <el-form-item-label label="PlayerGlobalMailView.title" v-model="sendGlobalMail.data.title" maxlength="256" />
      <el-form-item-label
        label="PlayerGlobalMailView.content"
        v-model="sendGlobalMail.data.content"
        maxlength="4096"
        :rows="10"
        show-word-limit
      />
    </el-form-ex>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="sendGlobalMail.display = false">
          {{ $t('com.btnCancel') }}
        </el-button>

        <el-button v-loading="sendGlobalMail.requesting" type="primary" @click="sendGlobalMail.onSubmit">
          {{ $t('com.btnSubmit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
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
import ElFormEx from '@/ui/components/ElForm/ElFormEx.vue'
import Dialog from '@/ui/components/DIalog/Dialog'

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
      searchData.value.brands.push(...selectAll)
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
  brands: [],
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
  page_size: getDefaultPageSize('/api/admin//mail/global/player/list'),
  total: 0,
})

/** 搜索 */
function requestSearch() {
  if (isRequestingSearch.value) {
    return
  }
  isRequestingSearch.value = true
  http_post('/api/admin/mail/global/player/list', { ...searchData.value, ...searchPageData.value }, false)
    .then((response) => {
      tableData.value = response.mails
      searchPageData.value.total = response.total
    })
    .catch(() => {})
    .finally(() => {
      isRequestingSearch.value = false
    })
}
requestSearch()

/** 修改每页显示数量 */
function onPageNumChange(value) {
  searchPageData.value.page_size = value
  setDefaultPageSize('/api/admin/mail/global/player/list', value)
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

const sendGlobalMail = ref({
  display: false,
  data: {
    brands: [],
    title: '',
    content: '',
  },
  requesting: false,
  onSubmit: () => {},
})
function onSendGlobalMail() {
  sendGlobalMail.value.data.title = ''
  sendGlobalMail.value.data.content = ''
  sendGlobalMail.value.data.brands = []
  sendGlobalMail.value.display = true
  sendGlobalMail.value.onSubmit = () => {
    if (sendGlobalMail.value.requesting) {
      return
    }
    http_post('/api/admin/mail/global/player/send', sendGlobalMail.value.data, true)
      .then(() => {
        requestSearch()
        sendGlobalMail.value.display = false
      })
      .catch(() => {})
      .finally(() => {
        sendGlobalMail.value.requesting = false
      })
  }
}

function onDisplayContent(index, row) {
  Dialog.tip({
    content: row.content,
    width: 600,
  })
}
</script>

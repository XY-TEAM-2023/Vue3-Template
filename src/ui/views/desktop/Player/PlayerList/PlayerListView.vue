<template>
  <el-card-ex :use-fold="true" shadow="never">
    <template #header> {{ $t('app.searchParamsTitle') }}</template>
    <el-form ref="searchDataRef" :model="searchData" label-position="top">
      <el-row :gutter="24">
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-label
            label="PlayerListView.playerId"
            v-model="searchData.search_id"
            prop="id"
            :placeholder="null"
            :maxlength="null"
            clearable
          />
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-label
            label="PlayerListView.account"
            v-model="searchData.search_account"
            prop="search_account"
            :placeholder="null"
            :maxlength="null"
            clearable
          />
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-label
            label="PlayerListView.nickName"
            v-model="searchData.search_name"
            prop="name"
            :placeholder="null"
            :maxlength="null"
            clearable
          />
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-label
            label="PlayerListView.phone"
            v-model="searchData.search_phone"
            prop="search_phone"
            :placeholder="null"
            :maxlength="null"
            clearable
          />
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div style="display: flex; margin-left: auto">
        <el-button type="warning" @click="onResetSearch" style="width: 100px"> {{ $t('com.btnReset') }}</el-button>
        <el-button type="primary" @click="onSearch" style="width: 100px"> {{ $t('com.btnSearch') }}</el-button>
      </div>
    </template>
  </el-card-ex>
  <el-card-ex :use-fold="false" shadow="never" style="margin-top: 10px">
    <template #header> {{ $t('app.searchResultTitle') }}</template>

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
      <el-table-column-index label="com.index" width="80" align="center" />
      <el-table-column-integer label="PlayerListView.playerId" prop="id" align="center" width="80" />
      <el-table-column-label label="PlayerListView.agent" prop="agent_code" align="center" width="180" />
      <el-table-column-label label="PlayerListView.level" prop="level" align="center" width="100" />
      <el-table-column-label label="PlayerListView.account" prop="account" align="center" width="120" />
      <el-table-column-label label="PlayerListView.nickName" prop="name" align="center" width="120" />
      <el-table-column-money
        label="PlayerListView.balance"
        prop="balance"
        align="center"
        width="120"
        test="123"
        can-edit
        @click="onChangeBalance"
      />
      <el-table-column-label label="PlayerListView.bankName" prop="bank_name" align="center" width="100" />
      <el-table-column-label label="PlayerListView.bankNum" prop="bank_num" align="center" width="140" />
      <el-table-column-label label="PlayerListView.phone" prop="phone_num" align="center" width="120" />
      <el-table-column-ex label="PlayerListView.onlineStatus" prop="online" align="center" width="100">
        <template #default="scope">
          {{ scope.row.online }}
        </template>
      </el-table-column-ex>
      <el-table-column-label label="PlayerListView.loginPlatform" prop="platform" align="center" width="120" />
      <el-table-column-label label="PlayerListView.loginIP" prop="login_ip" align="center" width="120" />
      <el-table-column-timestamp label="PlayerListView.loginTime" prop="login_ts" align="center" width="160" />
      <el-table-column-ex label="PlayerListView.lockStatus" prop="online" align="center">
        <template #default="scope">
          {{ scope.row.lock_ts > 0 }}
        </template>
      </el-table-column-ex>
      <el-table-column-label label="PlayerListView.lockNote" prop="lock_note" width="200" align="center" />
      <el-table-column-timestamp label="PlayerListView.lockTime" prop="lock_ts" align="center" width="160" />
      <el-table-column-timestamp label="PlayerListView.regTime" prop="register_ts" align="center" width="160" />
      <el-table-column-ex label="PlayerListView.invoke" prop="test" align="center" width="100">
        <template #default="scope">
          <el-button v-if="scope.row.lock_ts === 0" type="danger" size="small" @click="onLock(scope.row)">
            {{ $t('PlayerListView.btnLock') }}
          </el-button>
          <el-button v-if="scope.row.lock_ts !== 0" type="info" size="small" @click="onUnlock(scope.row)">
            {{ $t('PlayerListView.btnUnlock') }}
          </el-button>
        </template>
      </el-table-column-ex>
    </el-table-ex>
  </el-card-ex>

  <el-dialog v-model="changeBalance.display" :title="$t('PlayerListView.changeBalanceTitle')" width="30%" :close-on-click-modal="false">
    <el-form-ex>
      <el-form-item-label v-model="changeBalance.account" label="PlayerListView.account" disabled />
      <el-form-item-integer v-model="changeBalance.amount" label="PlayerListView.changeAmountTitle" />
    </el-form-ex>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="changeBalance.display = false">
          {{ $t('com.btnCancel') }}
        </el-button>

        <el-button v-loading="changeBalance.requesting" type="primary" @click="changeBalance.onSubmit">
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
import Dialog from '@/ui/components/DIalog/Dialog'
import ElFormEx from '@/ui/components/ElForm/ElFormEx.vue'
import ElTableColumnEx from '@/ui/components/ElTable/ElTableColumnEx.vue'

const appStore = useAppStore()

/** 搜索Form对象 */
const searchDataRef = ref(null)
/** 搜索数据 */
const searchData = ref({
  /** 玩家id */
  search_id: undefined,
  /** 账号 */
  search_account: undefined,
  /** 用户名 */
  search_name: undefined,
  /** 手机号 */
  search_phone: undefined,
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
  page_size: getDefaultPageSize('/player/init'),
  total: 0,
})

/** 搜索 */
function requestSearch() {
  if (isRequestingSearch.value) {
    return
  }
  isRequestingSearch.value = true
  http_post('/api/admin/player/list', { ...searchData.value, ...searchPageData.value }, false)
    .then((response) => {
      console.log(response)
      tableData.value = response.players
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
  setDefaultPageSize('/player/init', value)
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

function onLock(row) {
  Dialog.input({
    title: '封禁账号',
    placeholder: '封禁原因',
    onClose: () => {},
    onSubmit: (value, cancelCb, closeCb) => {
      http_post('/api/admin/player/lock', {
        id: row.id,
        note: value,
      })
        .then(() => {
          requestSearch()
          closeCb()
        })
        .catch(() => {
          cancelCb()
        })
    },
  })
}

function onUnlock(row) {
  Dialog.tip({
    content: `是否确定解封该账号(${row.account})?`,
    displayCancelBtn: true,
    onClose: () => {},
    onSubmit: (value, cancelCb, closeCb) => {
      http_post('/api/admin/player/unlock', {
        id: row.id,
      })
        .then(() => {
          requestSearch()
          closeCb()
        })
        .catch(() => {
          cancelCb()
        })
    },
  })
}

const changeBalance = ref({
  account: '',
  amount: 0,
  balance: 0,
  display: false,
  requesting: false,
  onSubmit: () => {},
})

function onChangeBalance(index, row) {
  console.log(index, row)
  changeBalance.value.account = row.account
  changeBalance.value.amount = 0
  changeBalance.value.balance = row.balance
  changeBalance.value.display = true
  changeBalance.value.onSubmit = () => {
    changeBalance.value.requesting = true
    http_post('/api/admin/player/edit/amount', { id: row.id, amount: changeBalance.value.amount }, true)
      .then(() => {
        changeBalance.value.requesting = false
        changeBalance.value.display = false
        requestSearch()
      })
      .catch(() => {})
      .finally(() => {
        changeBalance.value.requesting = false
      })
  }
}

/** 表格相关事件 */
const tableEvents = {}
</script>

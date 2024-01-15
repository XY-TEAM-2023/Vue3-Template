

<template>
  <el-card-ex :use-fold="true" shadow="never">
    <template #header> {{ $t('app.searchParamsTitle') }} </template>
    <el-form ref="searchDataRef" :model="searchData" label-position="top">
      <el-row :gutter="24">

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-date
            label="指定日期"
            v-model="searchData.date"
            prop="date"
            :placeholder="'指定日期2'"
            clearable
          />
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-date-time
            label="指定日期时间"
            v-model="searchData.datetime"
            prop="datetime"
            :placeholder="'指定日期时间2'"
            clearable
          />
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-label
            label="文本型"
            v-model="searchData.str"
            prop="str"
            :placeholder="'文本型2'"
            :maxlength="20"
            clearable
          />
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-integer
            label="整数型"
            v-model="searchData.int"
            prop="int"
            :placeholder="'整数型2'"
            :max="20"
            clearable
          />
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-float
            label="小数型"
            v-model="searchData.float"
            prop="float"
            :placeholder="'小数型2'"
            :min='10'
            :max="20"
            clearable
          />
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-select-local
            label="选择框"
            v-model="searchData.selelct"
            :options='[{"label":"key","value":"value"},{"label":"key2","value":"value2"}]'
            prop="selelct"
            :placeholder="null"
            clearable
          />
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-select-server
            label="选择框-server"
            v-model="searchData.selectServer"
            prop="selectServer"
            url="/test/options"
            field="options"
            :placeholder="null"
            clearable
          />
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div style="display: flex; margin-left: auto">
        <el-button type="warning" @click="onResetSearch" style="width: 100px"> {{ $t('com.btnReset') }} </el-button>
        <el-button type="primary" @click="onSearch" style="width: 100px"> {{ $t('com.btnSearch') }} </el-button>
      </div>
    </template>
  </el-card-ex>


  <el-card-ex :use-fold="false" shadow="never" style="margin-top: 10px">
    <template #header> {{ $t('app.searchResultTitle') }} </template>

    <el-table-ex
      :data="tableData"
      v-loading='isRequestingSearch'
      :show-pagination="true"
      :is-small-pagination="true"
      :current-page="searchPageData.page"
      :page-size="searchPageData.page_num"
      :page-sizes="appStore.pageSizes"
      :total="searchPageData.total"
      @size-change="onPageNumChange"
      @current-change='onPageChange'
    >

      <el-table-column-integer label="玩家ID" prop="id" align="left"  can-edit @edit="tableEvents.onEditId" />
      <el-table-column-label label="账号" prop="account" align="center"  can-edit @edit="tableEvents.onEditAccount" />
      <el-table-column-float label="角色" prop="role_id" align="center"  can-edit @edit="tableEvents.onEditRole_id" />
      <el-table-column-label label="备注" prop="note" align="center"  can-edit @edit="tableEvents.onEditNote" />
      <el-table-column-switch label="状态" prop="status" align="center"  can-edit @edit="tableEvents.onEditStatus" />
      <el-table-column-timestamp label="创建时间" prop="create_ts" align="left"  can-edit @edit="tableEvents.onEditCreate_ts" />
      <el-table-column-money label="金额" prop="keep_online_ts" align="center"  can-edit @edit="tableEvents.onEditKeep_online_ts" />
    </el-table-ex>
  </el-card-ex>
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
import { http_get, http_post } from '@/utils/axios'
import { useAppStore } from '@/stores/app'
import { getDefaultPageSize, setDefaultPageSize } from '@/utils'
import ElTableEx from '@/ui/components/ElTableEx.vue'
import ElTableColumnLabel from '@/ui/components/ElTable/ElTableColumnLabel.vue'
import ElTableColumnInteger from '@/ui/components/ElTable/ElTableColumnInteger.vue'
import ElTableColumnFloat from '@/ui/components/ElTable/ElTableColumnFloat.vue'
import ElTableColumnMoney from '@/ui/components/ElTable/ElTableColumnMoney.vue'
import ElTableColumnSwitch from '@/ui/components/ElTable/ElTableColumnSwitch.vue'
import ElTableColumnTimestamp from '@/ui/components/ElTable/ElTableColumnTimestamp.vue'

const appStore = useAppStore()

/** 搜索Form对象 */
const searchDataRef = ref(null)
/** 搜索数据 */
const searchData = ref({

  /** 指定日期 */
  date: undefined,
  /** 指定日期时间 */
  datetime: undefined,
  /** 文本型 */
  str: undefined,
  /** 整数型 */
  int: undefined,
  /** 小数型 */
  float: undefined,
  /** 选择框 */
  selelct: undefined,
  /** 选择框-server */
  selectServer: undefined,
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
  page_num: getDefaultPageSize('/test/users'),
  total: 0,
})

/** 搜索 */
function requestSearch() {
  if (isRequestingSearch.value) {
    return
  }
  isRequestingSearch.value = true
  http_post('/test/users', { ...searchData.value, ...searchPageData.value }, false)
    .then((response) => {
      tableData.value = response.result
      searchPageData.value.total = response.total
    })
    .catch(() => {})
    .finally(() => {
      isRequestingSearch.value = false
    })
  console.log('搜索')
}

/** 修改每页显示数量 */
function onPageNumChange(value) {
  searchPageData.value.page_num = value
  setDefaultPageSize('/test/users', value)
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
const tableEvents = {

  /** 修改玩家ID */
  onEditId: (index, row, newValue, cancelCb, closeCb) => {
    http_post('/user/edit/name', { id: row.id, newVal: newValue })
      .then(() => {
        requestSearch()
        closeCb()
      })
      .catch(() => {
        cancelCb()
      })
  },
  /** 修改账号 */
  onEditAccount: (index, row, newValue, cancelCb, closeCb) => {
    http_post('/user/edit/account', { id: row.id, undefined: newValue })
      .then(() => {
        requestSearch()
        closeCb()
      })
      .catch(() => {
        cancelCb()
      })
  },
  /** 修改角色 */
  onEditRole_id: (index, row, newValue, cancelCb, closeCb) => {
    http_post('/user/edit/role_id', { id: row.id, undefined: newValue })
      .then(() => {
        requestSearch()
        closeCb()
      })
      .catch(() => {
        cancelCb()
      })
  },
  /** 修改备注 */
  onEditNote: (index, row, newValue, cancelCb, closeCb) => {
    http_post('/user/edit/note', { id: row.id, undefined: newValue })
      .then(() => {
        requestSearch()
        closeCb()
      })
      .catch(() => {
        cancelCb()
      })
  },
  /** 修改状态 */
  onEditStatus: (index, row, newValue, cancelCb, closeCb) => {
    http_post('/user/edit/name', { id: row.id, undefined: newValue })
      .then(() => {
        requestSearch()
        closeCb()
      })
      .catch(() => {
        cancelCb()
      })
  },
  /** 修改创建时间 */
  onEditCreate_ts: (index, row, newValue, cancelCb, closeCb) => {
    http_post('undefined', { undefined: row.undefined, undefined: newValue })
      .then(() => {
        requestSearch()
        closeCb()
      })
      .catch(() => {
        cancelCb()
      })
  },
  /** 修改金额 */
  onEditKeep_online_ts: (index, row, newValue, cancelCb, closeCb) => {
    http_post('undefined', { undefined: row.undefined, undefined: newValue })
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
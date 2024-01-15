<script setup>
import { reactive, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import ElTableEx from '../../../components/ElTableEx.vue'
import ElCardEx from '@/ui/components/ElCardEx.vue'
import ElInputFloat from '@/ui/components/ElInput/ElInputFloat.vue'
import ElFormItemLabel from '@/ui/components/ElForm/ElFormItemLabel.vue'
import ElFormItemInteger from '@/ui/components/ElForm/ElFormItemInteger.vue'
import ElFormItemSelectLocal from '@/ui/components/ElForm/ElFormItemSelectLocal.vue'
import ElFormItemSelectServer from '@/ui/components/ElForm/ElFormItemSelectServer.vue'
import ElDatePickerDateTime from '@/ui/components/ElDatePicker/ElDatePickerDateTime.vue'
import ElDatePickerDate from '@/ui/components/ElDatePicker/ElDatePickerDate.vue'
import ElDatePickerRange from '@/ui/components/ElDatePicker/ElDatePickerRange.vue'
import ElFormItemFloat from '@/ui/components/ElForm/ElFormItemFloat.vue'
import ElFormItemCheckbox from '@/ui/components/ElForm/ElFormItemCheckbox.vue'
import ElFormItemDatePickerDate from '@/ui/components/ElForm/ElFormItemDatePickerDate.vue'
import ElFormItemDatePickerDateTime from '@/ui/components/ElForm/ElFormItemDatePickerDateTime.vue'
import ElFormItemDatePickerDateRange from '@/ui/components/ElForm/ElFormItemDatePickerDateRange.vue'
import ElTableColumnLabel from '@/ui/components/ElTable/ElTableColumnLabel.vue'

const appStore = useAppStore()
if (appStore.pageNum_userList <= 0) {
  appStore.pageNum_userList = appStore.pageSizes[0]
}

const searchAccount = ref('')
const value = ref('')
const value01 = ref('') // 用于日期选择器
const filterId = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
]

const searchData = ref(
  reactive({
    str: '',
    num: '',
    float: '',
    selectCode: '',
    timeRange: '',
  })
)
const selectOptions = reactive([
  {
    value: 1,
    label: 'key1',
  },
  {
    value: 2,
    label: 'key2',
  },
])

const selectOptions_Server = reactive([])

const isLoadingOptions = ref(false)
const requestOptions = () => {
  isLoadingOptions.value = true
  setTimeout(() => {
    isLoadingOptions.value = false
    selectOptions_Server.value = [
      {
        value: 1,
        label: 'key1',
      },
      {
        value: 2,
        label: 'key2',
      },
    ]
  }, 3000)
}

function onOptionsVisibleChange(isShow) {
  console.log(isShow)
  if (isShow) {
    requestOptions()
  }
}

const value2 = ref([])
function onChangeTimeRange(value) {
  console.log(value)
  console.log(value2.value)
}
const shortcuts = [
  {
    text: '今天',
    value: () => {
      const start = new Date()
      start.setHours(0, 0, 0, 0)

      const end = new Date()
      end.setDate(start.getDate() + 1)
      return [start, end]
    },
  },
  {
    text: '昨天',
    value: () => {
      // 获取当前日期
      const today = new Date()

      // 获取昨天的日期
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)

      // 设置昨天的开始时间（将时间设置为零点）
      const start = new Date(yesterday)
      start.setHours(0, 0, 0, 0)

      // 设置昨天的结束时间（将时间设置为23:59:59.999）
      const end = new Date(yesterday)
      end.setHours(23, 59, 59, 999)

      return [start, end]
    },
  },
  {
    text: '最近7天',
    value: () => {
      // 获取当前日期
      const today = new Date()

      // 设置时间为零点
      today.setHours(0, 0, 0, 0)

      // 获取7天前的日期
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)

      // 获取最近7天的开始时间（7天前的日期）
      const start = sevenDaysAgo

      // 获取最近7天的结束时间（昨天的日期，时间设置为23:59:59）
      const end = new Date(today)
      end.setDate(today.getDate() - 1)
      end.setHours(23, 59, 59, 999)

      return [start, end]
    },
  },
  {
    text: '本月',
    value: () => {
      // 获取当前日期
      const current = new Date()

      // 获取本月的第一天
      const start = new Date(current.getFullYear(), current.getMonth(), 1)

      // 设置时间为零点
      start.setHours(0, 0, 0, 0)

      return [start, current]
    },
  },
  {
    text: '上个月',
    value: () => {
      // 获取当前日期
      const today = new Date()

      // 获取上个月的第一天
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)

      // 设置时间为零点
      start.setHours(0, 0, 0, 0)

      // 获取上个月的最后一天
      const end = new Date(today.getFullYear(), today.getMonth(), 0)
      // 设置时间为23:59:59.999
      end.setHours(23, 59, 59, 999)
      return [start, end]
    },
  },
]

const onButtonTest = () => {
  console.log(searchData)
}
</script>

<template>
  <el-card-ex :use-fold="true" shadow="never">
    <template #header> 过滤器 </template>

    <el-form label-position="top">
      <el-row :gutter="24">
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-label label="文本" :required="true" v-model="searchData.str" placeholder="提示文本" :maxlength="10" clearable />
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-integer v-model="searchData.num" label="整数" required placeholder="提示文本123" :max="100" />
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-float label="小数" v-model="searchData.float" placeholder="提示" :min="-1.2" :max="222.23" :format-decimal="2" />
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-select-local
            :clearable="true"
            :options="selectOptions"
            label="选择框-代码定义选项"
            placeholder="选择xxx"
            :required="true"
          />
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-select-server
            v-model="searchData.selectCode"
            label="选择框-请求定义选项"
            url="/test/options"
            field="options"
            placeholder="选择.."
            :clearable="true"
            :required="true"
          />
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-checkbox label="逻辑型" v-model="searchData.selectCode" />
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-date-picker-date-range
            label="指定时间区间"
            v-model="value2"
            :shortcuts="shortcuts"
            :default-start-ts="1704211200000"
            :default-end-ts="1704297600000"
            :clearable="true"
            @change="onChangeTimeRange"
          />
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-date-picker-date
            label="指定日期"
            v-model="searchData.str"
            :default-ts="1704211200000"
            :clearable="true"
            @change="onChangeTimeRange"
          />
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-date-picker-date-time
            label="指定日期时间"
            v-model="searchData.str"
            :default-ts="1704211200000"
            :clearable="true"
            @change="onChangeTimeRange"
          />
        </el-col>
      </el-row>
    </el-form>
    <el-button @click="onButtonTest">test</el-button>
  </el-card-ex>

  <el-table-ex
    :data="userList"
    v-loading="isRequestUserList"
    v-model:current-page="searchPage"
    v-model:page-size="appStore.pageNum_userList"
    :page-sizes="appStore.pageSizes"
    :total="total"
    :show-select="true"
    style="margin-top: 10px"
    @current-change="requestUserList"
    @size-change="requestUserList"
    @selection-change="onSelectionChange"
  >
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column-label label="文本" prop="str" :can-edit="true" />
    <el-table-column prop="role_id" width="100%" align="center" :label="$t('FIListView.RequestTime')" />
    <el-table-column prop="account" width="100%" align="center" :label="$t('FIListView.MemberName')" />
    <el-table-column prop="account" width="100%" align="center" :label="$t('FIListView.PhoneNumber')" />
    <el-table-column prop="role_id" width="100%" align="center" :label="$t('FIListView.DepositorName')" />
    <el-table-column prop="account" width="140px" align="center" :label="$t('FIListView.LastWithdrawalName')" />
    <el-table-column prop="role_id" sortable width="130px" align="center" :label="$t('FIListView.RequestAmount')" />
    <el-table-column prop="account" sortable width="140px" align="center" :label="$t('FIListView.BalanceAtDeposit')" />
    <el-table-column prop="role_id" sortable width="140px" align="center" :label="$t('FIListView.DepositBonus')" />
    <el-table-column prop="account" width="140px" align="center" :label="$t('FIListView.DepositBankAccount')" />
    <el-table-column prop="SiteName" sortable width="130px" align="center" :label="$t('FIListView.SiteName')" />
    <el-table-column prop="GameName" sortable width="100%" align="center" :label="$t('FIListView.GameName')" />
    <el-table-column prop="MemberStatus" sortable width="130px" align="center" :label="$t('FIListView.MemberStatus')" />
    <el-table-column prop="role_id" sortable width="130px" align="center" :label="$t('FIListView.MemberLv')" />
    <el-table-column prop="account" width="100%" align="center" :label="$t('FIListView.MemberAccount')" />
    <el-table-column prop="role_id" width="100%" align="center" :label="$t('FIListView.MemberID')" />
    <el-table-column prop="account" width="100%" align="center" :label="$t('FIListView.Agent')" />
    <el-table-column prop="role_id" width="100%" align="center" :label="$t('FIListView.ShooterID')" />
    <el-table-column prop="account" width="100%" align="center" :label="$t('FIListView.Memo')" />
    <el-table-column prop="role_id" align="center" :label="$t('FIListView.Edit')" />
  </el-table-ex>
</template>

<style scoped>
.el-input-number :deep(.el-input__inner) {
  text-align: left;
}
</style>

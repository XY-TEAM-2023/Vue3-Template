<script setup>
import { reactive, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import ElTableEx from '../../../components/ElTableEx.vue'
import ElCardEx from '@/ui/components/ElCardEx.vue'
import ElInputInteger from '@/ui/components/ElInputInteger.vue'
import ElInputFloat from '@/ui/components/ElInputFloat.vue'

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
function onChangeTimeRange() {
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
</script>

<template>
  <el-card-ex :use-fold="true" shadow="never">
    <template #header> 过滤器 </template>

    <el-form label-position="top">
      <el-row :gutter="24">
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item label="文本" :required="true">
            <el-input v-model="searchData.str" placeholder="提示文本" :minlength="0" :maxlength="100" clearable />
          </el-form-item>
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item label="整数" :required="true">
            <el-input-integer v-model="searchData.num" placeholder="提示文本" :min="undefined" :max="100" />
          </el-form-item>
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item label="小数">
            <el-input-float v-model="searchData.float" placeholder="提示文本" :min="-1.22" :max="2.12" :format-decimal="2" />
          </el-form-item>
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item label="选择框-代码定义选项">
            <el-select v-model="searchData.selectCode" clearable placeholder="选择xxx" style="width: 100%">
              <template v-for="item in selectOptions" :key="item.value">
                <el-option :label="item.label" :value="item.value" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item label="选择框-请求定义选项">
            <el-select
              v-model="searchData.selectCode"
              :loading="isLoadingOptions"
              remote
              remote-show-suffix
              :remote-method="requestOptions"
              clearable
              placeholder="选择xxx"
              style="width: 100%"
              :visible-change="onOptionsVisibleChange"
            >
              <template v-for="item in selectOptions_Server" :key="item.value">
                <el-option :label="item.label" :value="item.value" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item label="逻辑型">
            <el-select v-model="searchData.selectCode" clearable placeholder="选择xxx" style="width: 100%">
              <el-option label="真" :value="true" />
              <el-option label="假" :value="false" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item label="时间区间">
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              :shortcuts="shortcuts"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              @change="onChangeTimeRange"
            />
          </el-form-item>
        </el-col>

        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item label="指定天">
            <el-date-picker v-model="value2" type="date" placeholder="Pick a Date" format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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

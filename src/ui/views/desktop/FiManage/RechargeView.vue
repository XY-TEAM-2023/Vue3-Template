<template>
  <el-card>
    <div>
      <el-row>
        <el-col :span="24">
          <div class="label-holder">
            <el-form class="inline-form">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="4">
                  <el-form-item :label="$t('memberListView.Date')">
                    <el-date-picker
                      v-model="value01"
                      type="daterange"
                      range-separator="To"
                      start-placeholder="Start"
                      end-placeholder="End"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4">
                  <el-form-item :label="$t('memberListView.SiteName')">
                    <el-select v-model="value" class="m-2" placeholder="Select">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4">
                  <el-form-item :label="$t('memberListView.MemberStatus')">
                    <el-select v-model="value" class="m-2" placeholder="Select">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4">
                  <el-form-item :label="$t('memberListView.MemberLevel')">
                    <el-input v-model="filterId" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4">
                  <el-form-item :label="$t('memberListView.MemberAccount')">
                    <el-input v-model="filterId" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4">
                  <el-form-item :label="$t('memberListView.DepositorName')">
                    <el-input v-model="filterId" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4" style="margin-top: 10px">
                  <el-form-item :label="$t('memberListView.PhoneNumber')">
                    <el-input v-model="filterId" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4" style="margin-top: 10px">
                  <el-form-item :label="$t('memberListView.ShooterID')">
                    <el-input v-model="filterId" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4" style="margin-top: 10px">
                  <el-form-item>
                    <el-button type="primary">{{ $t('com.btnSearch') }}</el-button>
                    <el-button type="info">{{ $t('com.btnCancel') }}</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
  <el-card style="margin-top: 5px">
    <el-table-ex
      :data="userList"
      v-loading="isRequestUserList"
      v-model:current-page="searchPage"
      v-model:page-size="appStore.pageNum_userList"
      :page-sizes="appStore.pageSizes"
      :total="total"
      :show-select="true"
      @current-change="requestUserList"
      @size-change="requestUserList"
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="Date" width="100%" align="center" :label="$t('memberListView.Date')" />
      <el-table-column prop="SiteName" sortable width="100%" align="center" :label="$t('memberListView.SiteName')" />
      <el-table-column prop="GameName" sortable width="100%" align="center" :label="$t('memberListView.GameName')" />
      <el-table-column prop="MemberStatus" sortable width="100%" align="center" :label="$t('memberListView.MemberStatus')" />
      <el-table-column prop="role_id" sortable width="100%" align="center" :label="$t('memberListView.MemberLevel')" />
      <el-table-column prop="account" width="100%" align="center" :label="$t('memberListView.MemberAccount')" />
      <el-table-column prop="role_id" width="100%" align="center" :label="$t('memberListView.MemberID')" />
      <el-table-column prop="account" width="100%" align="center" :label="$t('memberListView.Agent')" />
      <el-table-column prop="account" width="100%" align="center" :label="$t('memberListView.MemberName')" />
      <el-table-column prop="role_id" width="100%" align="center" :label="$t('memberListView.DepositorName')" />
      <el-table-column prop="account" align="center" :label="$t('memberListView.LastWithdrawalName')" />
      <el-table-column prop="role_id" sortable width="100%" align="center" :label="$t('memberListView.MemberLv')" />
      <el-table-column prop="account" width="100%" align="center" :label="$t('memberListView.PhoneNumber')" />
      <el-table-column prop="role_id" sortable width="100%" align="center" :label="$t('memberListView.RequestAmount')" />
      <el-table-column prop="account" sortable width="100%" align="center" :label="$t('memberListView.BalanceAtDeposit')" />
      <el-table-column prop="role_id" sortable width="100%" align="center" :label="$t('memberListView.DepositBonus')" />
      <el-table-column prop="account" align="center" :label="$t('memberListView.DepositBankAccount')" />
      <el-table-column prop="role_id" width="100%" align="center" :label="$t('memberListView.ShooterID')" />
      <el-table-column prop="account" width="100%" align="center" :label="$t('memberListView.Memo')" />
      <el-table-column prop="role_id" align="center" :label="$t('memberListView.RequestTime')" />
      <el-table-column prop="role_id" align="center" :label="$t('memberListView.Edit')" />
    </el-table-ex>
  </el-card>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { request_user_clear_otp, request_user_list, request_user_lock } from '@/api/user'
import ElInputSearch from '@/ui/components/ElInputSearch.vue'
import { useAppStore } from '@/stores/app'
import { Delete, Edit, Share } from '@element-plus/icons-vue'
import UiSvg from '@/ui/components/UiSvg.vue'
import { useUserStore } from '@/stores/user'
import ElTableEx from '../../../components/ElTableEx.vue'

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
</script>

<style scoped>
.el-table-column {
  width: 100%;
}
</style>

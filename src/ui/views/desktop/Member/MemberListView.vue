<template>
  <el-card>
    <div>
      <el-row>
        <el-col :span="24">
          <div class="label-holder">
            <el-form class="inline-form">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="4">
                  <el-form-item :label="$t('FIListView.Date')">
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
                  <el-form-item :label="$t('FIListView.SiteName')">
                    <el-select v-model="value" class="m-2" placeholder="Select">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4">
                  <el-form-item :label="$t('FIListView.MemberStatus')">
                    <el-select v-model="value" class="m-2" placeholder="Select">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4">
                  <el-form-item :label="$t('FIListView.MemberLv')">
                    <el-input v-model="filterId" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4">
                  <el-form-item :label="$t('FIListView.MemberAccount')">
                    <el-input v-model="filterId" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4">
                  <el-form-item :label="$t('FIListView.DepositorName')">
                    <el-input v-model="filterId" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4" style="margin-top: 10px">
                  <el-form-item :label="$t('FIListView.PhoneNumber')">
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
      <el-table-column prop="role_id" width="100%" align="center" :label="$t('MemberView.Name')" />
      <el-table-column prop="account" width="100%" align="center" :label="$t('MemberView.MemberNumber')" />
      <el-table-column prop="account" width="100%" align="center" :label="$t('MemberView.MemberAccount')" />
      <el-table-column prop="role_id" width="100%" align="center" :label="$t('MemberView.MemberStatus')" />
      <el-table-column prop="account" width="140px" align="center" :label="$t('MemberView.TestStatus')" />
      <el-table-column prop="role_id" sortable width="130px" align="center" :label="$t('MemberView.PhoneNumber')" />
      <el-table-column prop="account" width="140px" align="center" :label="$t('MemberView.MemberGrade')" />
      <el-table-column prop="account" sortable width="140px" align="center" :label="$t('MemberView.RegistrationTime')" />
      <el-table-column prop="account" sortable width="150px" align="center" :label="$t('MemberView.FirstDepositDate')" />
      <el-table-column prop="SiteName" sortable width="150px" align="center" :label="$t('MemberView.LastDepositDate')" />
      <el-table-column prop="GameName" sortable width="150%" align="center" :label="$t('MemberView.LastLogin')" />
      <el-table-column prop="MemberStatus" sortable width="130px" align="center" :label="$t('MemberView.MemberStatus')" />
      <el-table-column prop="role_id" sortable width="130px" align="center" :label="$t('MemberView.LastBet')" />
      <el-table-column prop="account" width="100%" align="center" :label="$t('MemberView.Referrer')" />
      <el-table-column prop="role_id" width="100%" align="center" :label="$t('MemberView.Balance')" />
      <el-table-column prop="account" width="100%" align="center" :label="$t('MemberView.Agent')" />
      <el-table-column prop="account" width="100%" align="center" :label="$t('MemberView.Memo')" />
    </el-table-ex>
  </el-card>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { useAppStore } from '@/stores/app'
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

<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <!-- 添加 height: 100%; -->
    <div style="margin-bottom: 10px">
      <!--  创建账号  -->
      <creat-user-dialog :is-show="showCreateUser" @close="showCreateUser = false" @refresh="requestUserList" />
      <el-button type="primary" @click="onCreateAccount">{{ $t('com.btnCreate') }}</el-button>

      <!--  搜索账号  -->
      <el-input-search
        v-model="searchAccount"
        placeholder="userListView.searchAccount"
        width="200"
        @search="requestUserList"
        max-length="20"
        style="margin-left: 10px"
      />
    </div>

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
      <el-table-column prop="account" align="left" :label="$t('userListView.account')" />
      <el-table-column prop="role_id" align="center" :label="$t('userListView.role')" />
      <!--  账号状态  -->
      <el-table-column :label="$t('userListView.accountStatus')" align="center" width="120">
        <template #default="scope">
          <el-switch
            size="small"
            v-model="scope.row.status"
            :disabled="userStore.userId === scope.row.id"
            :active-value="0"
            :inactive-value="1"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="onChangeUserStatus(scope.$index)"
          />
        </template>
      </el-table-column>
      <!--  OTP状态  -->
      <el-table-column prop="otp_status" align="center" width="200" :label="$t('userListView.otpStatus')">
        <template #default="scope">
          <div v-if="scope.row.otp_status === 0">
            <span class="color-gray">
              {{ $t('userListView.otpStatusClose') }}
            </span>
          </div>
          <div v-else-if="scope.row.otp_status === 1">
            <span class="color-yellow">
              {{ $t('userListView.otpStatusUnbind') }}
            </span>
          </div>
          <div v-else-if="scope.row.otp_status === 2">
            <span class="color-green">
              {{ $t('userListView.otpStatusBind') }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-cloumn-ts prop="update_ts" align="center" width="220" label="com.updateTime" />
      <el-table-cloumn-ts prop="create_ts" align="center" width="220" label="com.creatTime" />
      <el-table-column :label="$t('com.handler')" align="center" width="270">
        <template #default="scope">
          <el-button class="loading-small" type="primary" size="small" @click="onEditorUserInfo(scope.row)">
            {{ $t('com.btnEdit') }}
          </el-button>
          <!--  清除OTP  -->
          <el-button
            class="loading-small"
            :disabled="scope.row.otp_status !== 2"
            type="warning"
            size="small"
            v-loading="scope.row.isRequestingClear"
            @click="onClearOtp(scope.$index)"
          >
            {{ $t('userListView.clearOtp') }}
          </el-button>
          <!--  删除账号  -->
          <el-button type="danger" size="small">
            {{ $t('com.btnDelete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table-ex>

    <!-- 修改用户信息窗口 -->
    <change-user-info-dialog
      :is-show="showEditorUserInfo"
      :user-data="editorUserInfoData"
      @close="showEditorUserInfo = false"
      @refresh="requestUserList"
    ></change-user-info-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { request_user_clear_otp, request_user_list, request_user_lock } from '@/api/user'
import ElTableCloumnTs from '@/ui/components/ElTableCloumnTs.vue'
import ElInputSearch from '@/ui/components/ElInputSearch.vue'
import CreatUserDialog from './CreatUserDialog.vue'
import ChangeUserInfoDialog from './ChangeUserInfoDialog.vue'
import ElTableEx from '@/ui/components/ElTableEx.vue'
import { useAppStore } from '@/stores/app'
import { Delete, Edit, Share } from '@element-plus/icons-vue'
import UiSvg from '@/ui/components/UiSvg.vue'
import { useUserStore } from '@/stores/user'

const appStore = useAppStore()
if (appStore.pageNum_userList <= 0) {
  appStore.pageNum_userList = appStore.pageSizes[0]
}

const userStore = useUserStore()

/** 搜索的账号 */
const searchAccount = ref('')
/** 搜索第几页 */
const searchPage = ref(1)

/** 用户列表 */
const userList = reactive([])
/** 是否正在拉取用户列表 */
const isRequestUserList = ref(false)
/** 当前数据总条数 */
const total = ref(0)

/** 拉取用户列表*/
function requestUserList() {
  if (isRequestUserList.value) {
    return
  }

  isRequestUserList.value = true
  request_user_list(searchAccount.value, searchPage.value, appStore.pageNum_userList)
    .then((data) => {
      // console.log(data)
      userList.splice(0)
      userList.push(...data.result)
      total.value = data.total
      // console.log(userList)
    })
    .catch(() => {})
    .finally(() => {
      isRequestUserList.value = false
    })
}

requestUserList()

// 表头样式
// eslint-disable-next-line no-unused-vars
function tableHeader({ row, column, rowIndex, columnIndex }) {
  return { 'background-color': '#f5f7fa', color: '#333333', 'font-size': '14px', 'font-weight': 'bold  !important' }
}

// 自定义表格样式
// eslint-disable-next-line no-unused-vars
function tableCell({ row, rowIndex }) {
  return {}
}

const showCreateUser = ref(false)
/**
 * 创建账号
 */
function onCreateAccount() {
  showCreateUser.value = true
}

function onSelectionChange(val) {
  console.log(val)
}

/**
 * 修改用户封禁状态
 * @param index 用户数据下标
 */
function onChangeUserStatus(index) {
  if (userList[index].isRequesting) {
    return
  }
  userList[index].isRequesting = true
  request_user_lock(userList[index].id, userList[index].status)
    .then(() => {})
    .catch(() => {
      userList[index].status = userList[index].status === 0 ? 1 : 0
    })
    .finally(() => {
      userList[index].isRequesting = false
    })
}

const editorUserInfoData = ref(reactive({}))
const showEditorUserInfo = ref(false)
function onEditorUserInfo(info) {
  editorUserInfoData.value = info
  showEditorUserInfo.value = true
}

/**
 * 清除用户OTP
 * @param index 用户索引
 */
function onClearOtp(index) {
  const userData = userList[index]
  if (userData.isRequestingClear) {
    return
  }

  userList[index].isRequestingClear = true
  request_user_clear_otp(userData.id)
    .then(() => {
      userList[index].otp_status = 1
    })
    .catch(() => {})
    .finally(() => {
      userList[index].isRequestingClear = false
    })
}
</script>

<style scoped lang="scss">
// 修改标题样式
.custom-table-header {
  background-color: #f5f7fa;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
}

// 解决标题不能加粗的问题
:deep(*, *::before, *::after) {
  font-weight: inherit; // 继承父类
}

.color-red {
  color: #ef0000;
}

.color-gray {
  color: #545454;
}

.color-yellow {
  color: #c78600;
}

.color-green {
  color: #009800;
}

// 可点击单元格
.cell-can-click {
}

.cell-can-click:hover {
  text-decoration: underline; /* 显示下划线 */
  font-weight: 600;
  cursor: pointer; /* 将鼠标光标变为手指 */
}
</style>

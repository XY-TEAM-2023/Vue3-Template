<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <el-table-ex
      ref="tableRef"
      :data-table="userList"
      v-loading="isRequestUserList"
      v-model:current-page="searchPage"
      :total="total"
      :show-select="true"
      @current-change="requestUserList"
      @size-change="requestUserList"
      @selection-change="onSelectionChange"
    >
      <template #operations>
        <!--  创建账号  -->
        <el-button plain @click="onCreateAccount">
          {{ $t('com.btnCreate') }}
          <creat-user-dialog :is-show="showCreateUser" @close="showCreateUser = false" @refresh="requestUserListByRefresh" />
        </el-button>
      </template>

      <template #quickSearch>
        <!--  搜索账号  -->
        <el-input-search
          v-model="searchAccount"
          placeholder="userListView.searchAccount"
          width="200"
          @search="requestUserList"
          max-length="20"
        />
      </template>

      <!--      <el-table-column-ex type="selection" width="55" align="center" />-->
      <el-table-column-ex prop="account" align="center" width="100" show-overflow-tooltip :label="$t('userListView.account')" />

      <!--   角色名   -->
      <el-table-column-ex prop="role_name" align="center" width="140" :label="$t('userListView.role')" />

      <!--  是否在线  -->
      <el-table-column-ex :label="$t('userListView.onlineStatus')" prop="isOnline" align="center" width="130">
        <template #default="scope">
          <span v-if="scope.row.isOnline" class="color-green">
            {{ $t('userListView.onlineStatus_on') }}
          </span>
          <div v-else class="color-gray">
            {{ $t('userListView.onlineStatus_off') }}
          </div>
        </template>
      </el-table-column-ex>

      <!--  OTP状态  -->
      <el-table-column-ex prop="otp_status" align="center" width="180" :label="$t('userListView.otpStatus')">
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
      </el-table-column-ex>
      <!--  账号状态  -->
      <el-table-column-ex prop="status" :label="$t('userListView.accountStatus')" align="center" width="140">
        <template #default="scope">
          <div v-if="scope.row.status === 0">
            <span class="color-green">
              {{ $t('userListView.normal') }}
            </span>
          </div>
          <div v-else-if="scope.row.status === 1">
            <span class="color-red">
              {{ $t('userListView.lock') }}
            </span>
          </div>
        </template>
      </el-table-column-ex>
      <el-table-column-ts prop="update_ts" align="center" width="220" label="com.updateTime" />
      <el-table-column-ts prop="create_ts" align="center" width="220" label="com.creatTime" />

      <!--  操作按钮  -->
      <el-table-column-ex :label="$t('com.handler')" align="center" width="270">
        <template #default="scope">
          <div v-if="checkPermission(scope.row)">
            <el-button class="loading-small" style="width: 50px" type="primary" size="small" @click="onEditorUserInfo(scope.row)">
              {{ $t('com.btnEdit') }}
            </el-button>
            <!--  清除OTP  -->
            <el-button
              class="loading-small"
              :disabled="scope.row.otp_status !== 2"
              type="warning"
              size="small"
              style="width: 88px"
              v-loading="scope.row.isRequestingClear"
              @click="onClearOtp(scope.$index)"
            >
              {{ $t('userListView.clearOtp') }}
            </el-button>
            <!--  删除账号  -->
            <el-button type="danger" style="width: 50px" size="small" @click="onDeleteAccount(scope.$index)">
              {{ $t('com.btnDelete') }}
            </el-button>
          </div>
          <el-tag v-else type="info" effect="plain" class="unselect" style="width: 212px">
            {{ $t('com.noPermission') }}
          </el-tag>
        </template>
      </el-table-column-ex>
    </el-table-ex>

    <!-- 修改用户信息窗口 -->
    <change-user-info-dialog
      :is-show="showEditorUserInfo"
      :user-data="editorUserInfoData"
      @close="showEditorUserInfo = false"
      @refresh="requestUserListByRefresh"
    ></change-user-info-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import ElInputSearch from '@/ui/components/ElInput/ElInputSearch.vue'
import CreatUserDialog from './CreatUserDialog.vue'
import ChangeUserInfoDialog from './ChangeUserInfoDialog.vue'
import ElTableEx from '@/ui/components/ElTable/ElTableEx.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { http_post } from '@/axios'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import ElTableColumnTs from '@/ui/components/ElTable/ElTableColumnTs.vue'
import ElTableColumnEx from '@/ui/components/ElTable/ElTableColumnEx.vue'

const userStore = useUserStore()

/** 搜索的账号 */
const searchAccount = ref('')
/** 搜索第几页 */
const searchPage = ref(1)

/** 用户列表 */
const userList = ref([])
/** 是否正在拉取用户列表 */
const isRequestUserList = ref(false)
/** 当前数据总条数 */
const total = ref(0)
const subRoles = ref(reactive([]))

/**
 * 检查是否有权限操作
 * @param target
 * @returns {boolean}
 */
function checkPermission(target) {
  return subRoles.value.includes(target.role_id)
}

let roleList = []
let roleDict = {}

const tableRef = ref(null)

/** 拉取用户列表*/
function requestUserList() {
  if (isRequestUserList.value) {
    return
  }

  const cb_requestUserList = () => {
    http_post(
      '/api/admin/user/list',
      {
        search: searchAccount.value,
        page: searchPage.value,
        page_num: tableRef.value.getPageSize(),
      },
      false
    )
      .then((data) => {
        console.log(data)
        userList.value.splice(0)
        const curTs = new Date().getTime() // 获取当前的13位时间戳
        for (const obj of data.result) {
          console.log(obj)

          // 整理角色名
          if (obj.role_id === 0) {
            if (userStore.role_id === 0) {
              obj.role_name = 'develop'
            } else {
              continue
            }
          } else {
            if (roleDict[obj.role_id]) {
              obj.role_name = roleDict[obj.role_id].name
            } else {
              console.error(`account(${obj.id}) role(${obj.role_id}) is error`)
              continue
            }
          }
          // 整理在线状态
          obj.isOnline = obj.keep_online_ts > curTs
          delete obj.keep_online_ts
          userList.value.push(obj)
        }
        console.log('?????????????', userList.value)
        total.value = data.total
      })
      .catch(() => {})
      .finally(() => {
        isRequestUserList.value = false
      })
  }

  isRequestUserList.value = true
  if (roleList.length === 0) {
    //拉取子角色列表
    http_post('/api/admin/role/list', { type: 1 }, false)
      .then((data) => {
        subRoles.value = data.children

        roleList = data.result
        roleDict = {}
        roleList.forEach((item) => {
          roleDict[item.id] = item
        })

        cb_requestUserList()
      })
      .catch(() => {
        isRequestUserList.value = false
      })
  } else {
    cb_requestUserList()
  }
}

onMounted(() => {
  requestUserList()
})

function requestUserListByRefresh() {
  requestUserList()
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
  const userData = userList.value[index]
  if (userData.isRequestingClear) {
    return
  }

  userList.value[index].isRequestingClear = true
  //清空用户OTP密钥
  http_post('/api/admin/user/resetOtp', { user_id: userData.id }, true)
    .then(() => {
      userList.value[index].otp_status = 1
    })
    .catch(() => {})
    .finally(() => {
      userList.value[index].isRequestingClear = false
    })
}

/**
 * 删除账号
 * @param index 用户下标
 */
function onDeleteAccount(index) {
  const userData = userList.value[index]

  ElMessageBox.confirm(i18n.global.t('userListView.deleteAccountTip', { account: userData.account }), '', {
    confirmButtonText: i18n.global.t('com.btnOk'),
    cancelButtonText: i18n.global.t('com.btnCancel'),
    type: 'warning',
  })
    .then(() => {
      onDeleteAccountHandler(index)
    })
    .catch(() => {})
}

function onDeleteAccountHandler(index) {
  const userData = userList.value[index]
  if (userData.isRequestingDel) {
    return
  }
  userList.value[index].isRequestingDel = true
  // 删除账号
  http_post('/api/admin/user/delete', { user_id: userData.id }, true)
    .then(() => {
      userList.value.splice(index, 1)
    })
    .catch(() => {
      userList.value[index].isRequestingDel = false
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
  color: #9a9a9a;
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

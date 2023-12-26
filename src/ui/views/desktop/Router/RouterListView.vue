<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <!-- 添加 height: 100%; -->
    <div style="margin-bottom: 10px">
      <!--  创建账号  -->
      <el-button type="primary" @click="onCreateAccount">
        {{ $t('com.btnCreate') }}
      </el-button>
    </div>

    <el-table-ex :data="routerConfig" :show-select="true">
      <!--  组件图标  -->
      <el-table-column prop="meta.icon" align="center" :label="$t('routerListView.icon')">
        <template #default="scope">
          <div v-if="isElementIcon(scope.row.meta.icon)">
            <component :is="scope.row.meta.icon" />
          </div>
          <div v-else>ScgIcon</div>
        </template>
      </el-table-column>

      <!--   角色名   -->
      <el-table-column prop="meta.title" align="center" width="140" :label="$t('routerListView.title')" />
    </el-table-ex>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { request_user_clear_otp, request_user_delete_account, request_user_list, request_user_lock } from '@/api/user'
import ElTableEx from '@/ui/components/ElTableEx.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import { request_role_list } from '@/api/role'
import { asyncRoutes } from './test'

const routerConfig = ref(reactive(asyncRoutes))

function isElementIcon(icon) {
  return !icon.includes('.')
}

// -------------------------------------

const appStore = useAppStore()
if (appStore.pageNum_userList <= 0) {
  appStore.pageNum_userList = appStore.pageSizes[0]
}
function log(val) {
  console.log(val)
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
let isInitView = true

/** 拉取用户列表*/
function requestUserList() {
  if (isRequestUserList.value) {
    return
  }

  const cb_requestUserList = () => {
    request_user_list(isInitView, searchAccount.value, searchPage.value, appStore.pageNum_userList)
      .then((data) => {
        isInitView = false

        // console.log(data)
        userList.splice(0)
        const curTs = new Date().getTime() // 获取当前的13位时间戳
        for (const obj of data.result) {
          // 整理角色名
          if (obj.role_id === 0) {
            if (userStore.role_id === 0) {
              obj.role_name = 'develop'
            } else {
              continue
            }
          } else {
            obj.role_name = roleDict[obj.role_id].name
          }
          // 整理在线状态
          obj.isOnline = obj.keep_online_ts > curTs
          delete obj.keep_online_ts
          userList.push(obj)
        }
        total.value = data.total
      })
      .catch(() => {})
      .finally(() => {
        isRequestUserList.value = false
      })
  }

  isRequestUserList.value = true
  if (roleList.length === 0) {
    request_role_list(isInitView, false)
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
  isInitView = true
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

/**
 * 删除账号
 * @param index 用户下标
 */
function onDeleteAccount(index) {
  const userData = userList[index]

  ElMessageBox.confirm(i18n.global.t('routerListView.deleteAccountTip', { account: userData.account }), '', {
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
  const userData = userList[index]
  if (userData.isRequestingDel) {
    return
  }
  userList[index].isRequestingDel = true
  request_user_delete_account(userData.id)
    .then(() => {
      userList.splice(index, 1)
    })
    .catch(() => {
      userList[index].isRequestingDel = false
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

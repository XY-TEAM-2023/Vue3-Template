<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <!-- 添加 height: 100%; -->
    <div style="margin-bottom: 10px">
      <!--  创建账号  -->
      <el-button type="primary" @click="onCreate">{{ $t('com.btnCreate') }}</el-button>
    </div>

    <el-table-ex
      :data="roleList"
      v-loading="isRequestUserList"
      v-model:current-page="searchPage"
      v-model:page-size="appStore.pageNum_userList"
      :show-pagination="false"
      :highlight-current-row="true"
      row-key="id"
      :default-expand-all="true"
    >
      <el-table-column type="index" width="80" align="center" :label="$t('com.index')" />
      <!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column prop="name" width="200" align="left" :label="$t('roleListView.name')" />
      <el-table-column prop="note" align="left" :show-overflow-tooltip="true" :label="$t('roleListView.note')"> </el-table-column>
      <!--  账号状态  -->
      <el-table-column prop="status" :label="$t('roleListView.status')" align="center" width="100">
        <template #default="scope">
          <div v-if="scope.row.status === 0">
            <span class="color-green">
              {{ $t('roleListView.normal') }}
            </span>
          </div>
          <div v-else-if="scope.row.status === 1">
            <span class="color-red">
              {{ $t('roleListView.lock') }}
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column-ts prop="update_ts" align="center" width="180" label="com.updateTime" />
      <el-table-column-ts prop="create_ts" align="center" width="180" label="com.creatTime" />
      <el-table-column :label="$t('com.handler')" align="center" width="216">
        <template #default="scope">
          <div v-if="checkPermission(scope.row)">
            <!--  编辑信息  -->
            <el-button class="loading-small" type="primary" size="small" @click="onEditorUserInfo(scope.row)">
              {{ $t('com.btnEdit') }}
            </el-button>

            <!--  封禁  -->
            <el-button
              v-loading="scope.row.isRequestingLock"
              v-if="scope.row.status === 0"
              type="warning"
              size="small"
              @click="onLock(scope.row)"
            >
              {{ $t('roleListView.lock') }}
            </el-button>
            <!--  解禁  -->
            <el-button
              v-if="scope.row.status === 1"
              v-loading="scope.row.isRequestingLock"
              type="info"
              size="small"
              @click="onUnlock(scope.row)"
            >
              {{ $t('roleListView.unlock') }}
            </el-button>

            <!--  删除  -->
            <el-tooltip :disabled="scope.row.status === 0" effect="light" placement="left" :content="$t('roleListView.deleteEnableTip')">
              <el-button :disabled="scope.row.status !== 1" type="danger" size="small" @click="onDelete(scope.row)">
                {{ $t('com.btnDelete') }}
              </el-button>
            </el-tooltip>
          </div>
          <el-tag v-else type="info" effect="plain" class="unselect" style="width: 170px">
            {{ $t('com.noPermission') }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table-ex>

    <creat-role-dialog :is-show="showCreate" @close="showCreate = false" @refresh="onRefreshData" />
    <change-role-info-dialog
      :is-show="showEditorUserInfo"
      :role-data="editorInfoData"
      @close="showEditorUserInfo = false"
      @refresh="requestRoleTree"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { request_role_delete, request_role_lock, request_role_tree, request_role_unlock } from '@/api/role'
import ElTableColumnTs from '@/ui/components/ElTableColumnTs.vue'
import ElTableEx from '@/ui/components/ElTableEx.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import CreatRoleDialog from './CreatRoleDialog.vue'
import ChangeRoleInfoDialog from '@/ui/views/desktop/Role/ChangeRoleInfoDialog.vue'
import i18n from '@/i18n'
import { ElMessageBox } from 'element-plus'

const appStore = useAppStore()
if (appStore.pageNum_userList <= 0) {
  appStore.pageNum_userList = appStore.pageSizes[0]
}

const userStore = useUserStore()

/** 搜索第几页 */
const searchPage = ref(1)

/** 用户列表 */
const roleList = reactive([])
/** 是否正在拉取用户列表 */
const isRequestUserList = ref(false)
/** 当前数据总条数 */
const total = ref(0)

const subRoles = ref(reactive([]))
/** 拉取角色树形结构*/
function requestRoleTree() {
  if (isRequestUserList.value) {
    return
  }

  isRequestUserList.value = true
  request_role_tree(true)
    .then((data) => {
      subRoles.value = data.children
      // console.log(data)
      roleList.splice(0)
      roleList.push(...data.result)
      total.value = data.total
      // console.log(roleList)
    })
    .catch(() => {})
    .finally(() => {
      isRequestUserList.value = false
    })
}

/**
 * 检查是否有权限操作
 * @param target
 * @returns {boolean}
 */
function checkPermission(target) {
  return subRoles.value.includes(target.id)
}

onMounted(() => {
  requestRoleTree()
})

const showCreate = ref(false)
/**
 * 创建角色
 */
function onCreate() {
  showCreate.value = true
}

/**
 * 修改用户封禁状态
 */
function onLock(role) {
  if (role.isRequestingLock) {
    return
  }

  const cb_request = (include_children) => {
    role.isRequestingLock = true
    request_role_lock(role.id, include_children)
      .then(() => {
        requestRoleTree()
      })
      .catch(() => {})
      .finally(() => {
        role.isRequestingLock = false
      })
  }

  ElMessageBox.confirm(i18n.global.t('roleListView.lockTip', { name: role.name }), '', {
    confirmButtonText: i18n.global.t('com.btnOk'),
    cancelButtonText: i18n.global.t('com.btnCancel'),
    type: 'warning',
  })
    .then(() => {
      if (role.children && role.children.length > 0) {
        ElMessageBox.confirm(i18n.global.t('roleListView.lockChildrenTip'), '', {
          confirmButtonText: i18n.global.t('com.btnYes'),
          cancelButtonText: i18n.global.t('com.btnNo'),
          type: 'warning',
        })
          .then(() => {
            cb_request(true)
          })
          .catch(() => {
            cb_request(false)
          })
      } else {
        cb_request(false)
      }
    })
    .catch(() => {})
}

function onUnlock(role) {
  if (role.isRequestingLock) {
    return
  }

  const cb_request = (include_children) => {
    role.isRequestingLock = true
    request_role_unlock(role.id, include_children)
      .then(() => {
        requestRoleTree()
      })
      .catch(() => {})
      .finally(() => {
        role.isRequestingLock = false
      })
  }

  ElMessageBox.confirm(i18n.global.t('roleListView.unlockTip', { name: role.name }), '', {
    confirmButtonText: i18n.global.t('com.btnOk'),
    cancelButtonText: i18n.global.t('com.btnCancel'),
    type: 'warning',
  })
    .then(() => {
      if (role.children && role.children.length > 0) {
        ElMessageBox.confirm(i18n.global.t('roleListView.unlockChildrenTip'), '', {
          confirmButtonText: i18n.global.t('com.btnYes'),
          cancelButtonText: i18n.global.t('com.btnNo'),
          type: 'warning',
        })
          .then(() => {
            cb_request(true)
          })
          .catch(() => {
            cb_request(false)
          })
      } else {
        cb_request(false)
      }
    })
    .catch(() => {})
}

const editorInfoData = ref(reactive({}))
const showEditorUserInfo = ref(false)
function onEditorUserInfo(info) {
  editorInfoData.value = info
  showEditorUserInfo.value = true
}

/**
 * 清除用户OTP
 * @param index 用户索引
 */
function onDelete(role) {
  if (role.isRequestingDelte) {
    return
  }

  const cb_request = () => {
    role.isRequestingDelte = true
    request_role_delete(role.id)
      .then(() => {
        requestRoleTree()
      })
      .catch(() => {})
      .finally(() => {
        role.isRequestingDelte = false
      })
  }

  ElMessageBox.confirm(i18n.global.t('roleListView.deleteTip', { name: role.name }), '', {
    confirmButtonText: i18n.global.t('com.btnOk'),
    cancelButtonText: i18n.global.t('com.btnCancel'),
    type: 'warning',
  })
    .then(() => {
      cb_request()
    })
    .catch(() => {})
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

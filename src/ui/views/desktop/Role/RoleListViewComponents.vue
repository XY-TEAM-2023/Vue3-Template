<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <!--  角色列表  -->
    <el-card style="width: 260px" class="unselect">
      <!--  标题  -->
      <template #header>
        <div style="display: flex" class="flex-left-center">
          <ui-svg :svg-code="svgPermission" svg-size="24" svg-color="#3259ce" />
          <span style="margin: 2px 0 0 4px">角色列表</span>
        </div>
      </template>

      <!--  内容  -->
      <el-tree
        ref="roleTree"
        class="role"
        :data="roleList"
        :current-node-key="selectRole.value ? selectRole.value.id : ''"
        node-key="id"
        highlight-current
        default-expand-all
        :expand-on-click-node="false"
        @current-change="onChangeRoleSelect"
        style="min-height: 200px"
      >
        <template #default="{ node, data }">
          <div v-menu="onRolesMenu(data)" class="role-item">
            <span v-if="data.status === 1" style="margin: 3px 1px 0 -3px">
              <ui-svg :svg-code="svgLock" size="16" svg-color="#606266" />
            </span>
            <span>{{ data.name }}</span>
          </div>
        </template>
      </el-tree>

      <!--  底部  -->
      <template #footer>
        <div style="min-height: 40px; width: 100%">
          <span style="font-weight: bold"> {{ $t('roleListView.note') }}: </span>
          <span style="color: #4b4b4b">
            {{ selectRole ? selectRole.note : '' }}
          </span>
        </div>
      </template>
    </el-card>

    <creat-role-dialog :is-show="showCreate" :parent="createParent" @close="showCreate = false" @refresh="requestRoleTree" />
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
import ElTableColumnTs from '@/ui/components/ElTable/ElTableColumnTs.vue'
import ElTableEx from '@/ui/components/ElTableEx.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import CreatRoleDialog from './CreatRoleDialog.vue'
import ChangeRoleInfoDialog from '@/ui/views/desktop/Role/ChangeRoleInfoDialog.vue'
import i18n from '@/i18n'
import { ElMessageBox } from 'element-plus'
import UiSvg from '@/ui/components/UiSvg.vue'

const appStore = useAppStore()
if (appStore.pageNum_userList <= 0) {
  appStore.pageNum_userList = appStore.pageSizes[0]
}

const userStore = useUserStore()

/** 搜索第几页 */
const searchPage = ref(1)
const svgPermission =
  '<svg t="1704024937965" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21796" width="32" height="32"><path d="M832 128H192a64.19 64.19 0 0 0-64 64v640a64.19 64.19 0 0 0 64 64h640a64.19 64.19 0 0 0 64-64V192a64.19 64.19 0 0 0-64-64zM628.36 320c48.29 0 87 39.82 87 89.14s-38.69 89.14-87 89.14-87.27-39.82-87.27-89.14S580.07 320 628.36 320z m-232.73 0c48.29 0 87 39.82 87 89.14s-38.69 89.14-87 89.14-87.27-39.82-87.27-89.14S347.35 320 395.64 320z m203.64 416H192v-74.29c0-69.23 135.85-104 203.64-104s203.64 34.77 203.64 104zM832 736H657.45v-74.29c0-44-23.56-77.55-57.31-102.51 10.18-0.89 19.78-1.49 28.22-1.49 67.78 0 203.64 34.77 203.64 104z" fill="#040000" p-id="21797"></path></svg>'

const roleTree = ref(null)
const selectRole = ref(reactive({}))
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
      selectRole.value = {}
      // console.log(roleList)
    })
    .catch(() => {})
    .finally(() => {
      isRequestUserList.value = false
    })
}

onMounted(() => {
  requestRoleTree()
})

function onChangeRoleSelect(data, node) {
  selectRole.value = data
}

const svgLock =
  '<svg t="1704032772325" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22855" width="32" height="32"><path d="M786.863158 485.052632h-48.505263V361.094737c0-118.568421-97.010526-215.578947-215.578948-215.578948h-10.778947c-118.568421 0-215.578947 97.010526-215.578947 215.578948v129.347368h-48.505264c-5.389474-5.389474-10.778947 0-10.778947 10.778948v371.873684c0 5.389474 5.389474 10.778947 10.778947 10.778947h538.947369c5.389474 0 10.778947-5.389474 10.778947-10.778947V501.221053c5.389474-10.778947 0-16.168421-10.778947-16.168421zM366.484211 485.052632V361.094737C366.484211 280.252632 431.157895 215.578947 512 215.578947h10.778947c80.842105 0 145.515789 64.673684 145.51579 145.51579v129.347368L366.484211 485.052632z" p-id="22856"></path></svg>'

function onRolesMenu(data) {
  return reactive([
    // 创建
    {
      text: 'com.btnCreate',
      icon: '<svg t="1704012905527" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8133" width="32" height="32"><path d="M512 48.761905a65.015873 65.015873 0 0 1 65.015873 65.015873v333.206349H910.222222a65.015873 65.015873 0 1 1 0 130.031746H576.999619L577.015873 910.222222a65.015873 65.015873 0 1 1-130.031746 0l-0.016254-333.206349H113.777778a65.015873 65.015873 0 1 1 0-130.031746h333.206349V113.777778a65.015873 65.015873 0 0 1 65.015873-65.015873z" fill="#000000" p-id="8134"></path></svg>',
      action: () => {
        onCreate(data.id)
      },
    },
    // 编辑
    {
      text: 'com.btnEdit',
      icon: '<svg t="1704012826419" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7135" width="32" height="32"><path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z" p-id="7136"></path></svg>',
      action: () => {
        onEditorInfo(data)
      },
    },
    // 封禁、解封
    {
      text: data.status === 0 ? 'roleListView.lock' : 'roleListView.unlock',
      hoverColor: data.status === 0 ? '#856c00' : '#0e7e00',
      icon:
        data.status === 0
          ? '<svg t="1704012694077" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6017" width="32" height="32"><path d="M298.666667 341.333333V226.773333C298.666667 103.68 375.68 0 478.208 0h67.584C648.192 0 725.333333 103.808 725.333333 226.773333V341.333333h85.546667C857.898667 341.333333 896 379.52 896 426.410667v512.512A85.077333 85.077333 0 0 1 810.88 1024H213.12A85.162667 85.162667 0 0 1 128 938.922667V426.410667C128 379.434667 166.101333 341.333333 213.12 341.333333H298.666667z m85.333333 0h256V226.773333C640 146.346667 594.602667 85.333333 545.792 85.333333h-67.584C429.226667 85.333333 384 146.261333 384 226.773333V341.333333z m170.666667 329.984c25.6-14.72 42.666667-42.325333 42.666666-73.984 0-47.445333-38.186667-85.333333-85.333333-85.333333-47.445333 0-85.333333 38.186667-85.333333 85.333333 0 31.786667 17.152 59.306667 42.666666 73.984v96.298667a42.666667 42.666667 0 1 0 85.333334 0.426667v-96.725334z" fill="#3D3D3D" p-id="6018"></path></svg>'
          : '<svg t="1704012735596" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6157" width="32" height="32"><path d="M632.527307 498.500942q39.532957 14.463277 72.316384 39.532957t56.888889 58.335217 37.122411 73.280603 13.016949 83.404896q0 56.888889-21.212806 106.06403t-58.335217 85.815443-86.297552 57.853107-105.099812 21.212806-105.099812-21.212806-86.297552-57.853107-58.335217-85.815443-21.212806-106.06403q0-44.354049 13.499058-84.369115t37.60452-73.280603 57.370998-58.335217 72.798493-39.532957l0-404.971751q0-17.355932 6.26742-33.747646t17.838041-29.408663 27.480226-21.212806 34.229755-8.195857 35.676083 8.195857 30.854991 21.212806 21.212806 29.408663 7.713748 33.747646l0 405.93597zM542.854991 846.583804q38.568738 0 65.566855-26.998117t26.998117-66.531073q0-38.568738-26.998117-65.566855t-65.566855-26.998117q-39.532957 0-66.531073 26.998117t-26.998117 65.566855q0 39.532957 26.998117 66.531073t66.531073 26.998117zM751.126177 121.491525q61.709981 0 61.709981 57.853107l0 62.6742q0 33.747646-16.873823 46.764595t-37.122411 13.016949l-66.531073 0 0-180.308851 58.817326 0z" p-id="6158"></path></svg>',
      action: () => {
        console.log(data)
        if (data.status === 0) {
          onLock(data)
        } else {
          onUnlock(data)
        }
      },
    },
    // 删除
    {
      text: 'com.btnDelete',
      icon: 'DeleteFilled',
      hoverColor: '#b70000',
      action: () => {
        onDelete(data)
      },
    },
  ])
}

/**********************************************************************
 * 创建角色
 ********************************************************************/
const showCreate = ref(false)
const createParent = ref(0)
function onCreate(parent_id) {
  createParent.value = parent_id
  showCreate.value = true
}

/**********************************************************************
 * 修改用户封禁状态
 * ********************************************************************/
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
function onEditorInfo(info) {
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

:deep(.el-card) {
  height: 100% !important;
}

.role-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
</style>

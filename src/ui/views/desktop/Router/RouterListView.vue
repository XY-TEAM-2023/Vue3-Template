<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <!-- 添加 height: 100%; -->
    <div style="margin-bottom: 10px">
      <!--   加载项目   -->
      <router-list-view-load-project @loaded="onLoadProject" />
      <!--   更新路由配置   -->
      <router-list-view-update-router-config
        :file-dict="fileDict"
        :router-list="routerList"
        :async-routes="asyncRoutes"
        @refresh="requestRouterBase"
      />
      <!--   更新页面权限   -->
      <router-list-view-update-permission :file-dict="fileDict" :router-list="routerList" @refresh="requestRouterBase" />
    </div>

    <!--  目录还是文件  -->
    <el-table-ex v-loading="isRequestingBase" :data="routerConfig" :show-select="true" row-key="name" :show-pagination="false">
      <el-table-column :label="$t('routerListView.type')" align="center" width="100">
        <template #default="scope">
          <el-tag v-permission="2" v-if="scope.row.component" :style="tagStyle" type="warning" effect="dark">
            {{ $t('routerListView.view') }}
          </el-tag>
          <el-tag v-permission="2" v-else type="info" :style="tagStyle" effect="dark">
            {{ $t('routerListView.directory') }}
          </el-tag>
        </template>
      </el-table-column>

      <!--   名字  -->
      <el-table-column prop="name" align="left" :label="$t('routerListView.name')" width="120" />

      <!--  组件图标  -->
      <el-table-column prop="meta.icon" align="center" :label="$t('routerListView.icon')" width="70">
        <template #default="scope">
          <div v-permission-event="3" v-if="scope.row.icon" class="router-icon" @click="onSelectIcon(scope.$index)">
            <component v-if="isElementIcon(scope.row.icon)" :is="scope.row.icon" style="width: 23px; height: 23px" />
            <ui-svg v-else size="23px" svg-size="24" :svg-code="scope.row.icon" svg-color="#606266" svg-hover-color="#007aff" />
          </div>
        </template>
      </el-table-column>

      <!--   英文标题   -->
      <el-table-column-label
        prop="title_en"
        align="center"
        label="routerListView.english"
        width="160"
        edit-clearable
        v-permission-enable="4"
        :can-edit="hasPermission(1)"
        @edit="onEditText_en"
      />

      <!--   韩文标题  -->
      <el-table-column-label
        prop="title_ko"
        align="center"
        label="routerListView.korean"
        width="160"
        edit-clearable
        @edit="onEditText_ko"
      />

      <!--   中文标题  -->
      <el-table-column-label
        prop="title_zh"
        align="center"
        label="routerListView.chinese"
        width="160"
        edit-clearable
        @edit="onEditText_zh"
      />

      <!--   是否显示   -->
      <el-table-column align="center" width="90" :label="$t('routerListView.display')">
        <template #default="scope">
          <el-switch
            v-model="scope.row.display"
            :active-value="1"
            :inactive-value="0"
            size="small"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="onChangeDisplay(scope.row)"
          />
        </template>
      </el-table-column>

      <!--   是否缓存   -->
      <!--      <el-table-column align="center"  width="90" :label="$t('routerListView.cache')">-->
      <!--        <template #default="scope">-->
      <!--          <el-switch-->
      <!--            v-model="scope.row.cache"-->
      <!--            :active-value="1"-->
      <!--            :inactive-value="0"-->
      <!--            size="small"-->
      <!--            style="&#45;&#45;el-switch-on-color: #13ce66; &#45;&#45;el-switch-off-color: #ff4949"-->
      <!--            @change="onChangeCache(scope.row)"-->
      <!--          />-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--   文件路径  -->
      <el-table-column-label
        prop="component"
        align="left"
        label="routerListView.filePath"
        edit-width="600"
        edit-clearable
        @edit="onEditComponent"
      />

      <!--  删除按钮  -->
      <el-table-column :label="$t('com.handler')" align="center" width="220">
        <template #default="scope">
          <!--  查看组件权限  -->
          <el-button type="primary" size="small" @click="onDisplayMenuPermission(scope.row)">
            {{ $t('routerListView.displayPermission') }}
          </el-button>

          <!--  删除  -->
          <el-button type="danger" v-permission="333" size="small" @click="onDeleteRoute(scope.row)">
            {{ $t('com.btnDelete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table-ex>

    <el-dialog-select-icon
      :is-show="isDisplaySelectIcon"
      title="routerListView.changeIconTitle"
      :default-icon="selectIcon"
      :on-submit="onSelectIconResult"
      @close="isDisplaySelectIcon = false"
    />

    <!--  查看权限  -->
    <el-dialog v-model="displayMenuPermission" width="500px" :title="selectMenuTitle">
      <ui-menu-permission :menu-name="selectMenu.name" :display-editor="false" :has-permission="4" style="min-height: 150px" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import ElTableEx from '@/ui/components/ElTableEx.vue'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import UiSvg from '@/ui/components/UiSvg.vue'
import {
  request_menu_list,
  request_menu_edit_cache,
  request_menu_edit_component,
  request_menu_edit_delete,
  request_menu_edit_display,
  request_menu_edit_icon,
  request_menu_edit_title,
  request_menu_set_home,
} from '@/api/menu'
import ElDialogSelectIcon from '@/ui/components/ElDialogSelectIcon.vue'
import { getTextListMaxWidth, hasPermission } from '@/utils'
import ElTableColumnLabel from '@/ui/components/ElTable/ElTableColumnLabel.vue'
import RouterListViewLoadProject from './RouterListViewLoadProject.vue'
import RouterListViewUpdatePermission from './RouterListViewUpdatePermission.vue'
import RouterListViewUpdateRouterConfig from './RouterListViewUpdateRouterConfig.vue'
import UiMenuPermission from '@/ui/components/UiMenuPermission.vue'
import { useAppStore } from '@/stores/app'

const tagStyle = computed(() => {
  return {
    width: getTextListMaxWidth([i18n.global.t('routerListView.view'), i18n.global.t('routerListView.directory')]) + 10 + 'px',
  }
})

const routerConfig = ref(reactive([]))
const isRequestingBase = ref(false)
function requestRouterBase() {
  if (isRequestingBase.value) {
    return
  }
  isRequestingBase.value = true
  request_menu_list()
    .then((data) => {
      routerConfig.value = data.result
    })
    .catch(() => {})
    .finally(() => {
      isRequestingBase.value = false
    })
}
requestRouterBase(false)

function isElementIcon(icon) {
  if (Array.isArray(icon)) {
    return false
  }
  return !icon.includes('.')
}

const fileDict = ref(reactive([]))
const routerList = ref(reactive([]))
const asyncRoutes = ref(reactive([]))

function onLoadProject(file_dict, router_list, async_routes) {
  fileDict.value = file_dict
  routerList.value = router_list
  asyncRoutes.value = async_routes
}

/*******************************************************************
                                修改数据相关
 ******************************************************************/
function onEditText_en(index, row, newValue, cancelCb, closeCb) {
  onEditText('en')(index, row, newValue, cancelCb, closeCb)
}
function onEditText_zh(index, row, newValue, cancelCb, closeCb) {
  onEditText('zh')(index, row, newValue, cancelCb, closeCb)
}
function onEditText_ko(index, row, newValue, cancelCb, closeCb) {
  onEditText('ko')(index, row, newValue, cancelCb, closeCb)
}
function onEditText(local) {
  return (index, row, newValue, cancelCb, closeCb) => {
    request_menu_edit_title(row.id, newValue, local)
      .then(() => {
        requestRouterBase(false)
        closeCb()
      })
      .catch(() => {
        cancelCb()
      })
  }
}

/** 修改文件路径 */
function onEditComponent(index, row, newValue, cancelCb, closeCb) {
  request_menu_edit_component(row.id, newValue)
    .then(() => {
      requestRouterBase(false)
      closeCb()
    })
    .catch(() => {
      cancelCb()
    })
}

/** 修改路由显示状态 */
function onChangeDisplay(row) {
  if (row.requestingChangeDisplay) {
    return
  }
  row.requestingChangeDisplay = true
  request_menu_edit_display(row.id, row.display)
    .then(() => {
      requestRouterBase(false)
    })
    .catch(() => {
      row.display = row.display === 1 ? 0 : 1
    })
    .finally(() => {
      row.requestingChangeDisplay = false
    })
}

/** 修改路由缓存状态 */
function onChangeCache(row) {
  if (row.requestingChangeCache) {
    return
  }
  row.requestingChangeCache = true
  request_menu_edit_cache(row.id, row.cache)
    .then(() => {
      requestRouterBase(false)
    })
    .catch(() => {
      row.cache = row.cache === 1 ? 0 : 1
    })
    .finally(() => {
      row.requestingChangeCache = false
    })
}

// 修改图标
const isDisplaySelectIcon = ref(false)
const selectIcon = ref('')
let selectIconIndex = -1
let selectIconData = null
function onSelectIcon(index) {
  selectIconIndex = index
  selectIconData = routerConfig.value[index]
  // console.log(selectIconData)
  if (isDisplaySelectIcon.value) {
    return
  }
  selectIcon.value = selectIconData.icon
  // console.log(isDisplaySelectIcon.value, selectIcon.value)
  isDisplaySelectIcon.value = true
}

let requestingEditIcon = false
function onSelectIconResult(type, icon) {
  if (requestingEditIcon) {
    return
  }
  requestingEditIcon = true

  request_menu_edit_icon(routerConfig.value[selectIconIndex].id, icon)
    .then(() => {
      requestRouterBase(false)
    })
    .finally(() => {
      isDisplaySelectIcon.value = false
      requestingEditIcon = false
    })
}

function onSetAsHome(obj) {
  if (obj.isRequestingSetHome) {
    return
  }
  obj.isRequestingSetHome = true
  ElMessageBox.confirm(i18n.global.t('routerListView.homePageTip', { name: obj.name }), '', {
    confirmButtonText: i18n.global.t('com.btnOk'),
    cancelButtonText: i18n.global.t('com.btnCancel'),
    type: 'warning',
  })
    .then(() => {
      request_menu_set_home(obj.id)
        .then(() => {
          requestRouterBase(false)
        })
        .catch(() => {})
        .finally(() => {
          obj.isRequestingSetHome = false
        })
    })
    .catch(() => {
      obj.isRequestingSetHome = false
    })
}

/** 删除路由 */
function onDeleteRoute(obj) {
  if (obj.isRequestingDelete) {
    return
  }
  obj.isRequestingDelete = true
  ElMessageBox.confirm(i18n.global.t('routerListView.deleteTip', { name: obj.name }), '', {
    confirmButtonText: i18n.global.t('com.btnOk'),
    cancelButtonText: i18n.global.t('com.btnCancel'),
    type: 'warning',
  })
    .then(() => {
      request_menu_edit_delete(obj.id)
        .then(() => {
          requestRouterBase(false)
        })
        .catch(() => {})
        .finally(() => {
          obj.isRequestingDelete = false
        })
    })
    .catch(() => {
      obj.isRequestingDelete = false
    })
}

const appStore = useAppStore()
const displayMenuPermission = ref(false)
const selectMenu = ref(reactive({}))
const selectMenuTitle = computed(() => (selectMenu.value ? selectMenu.value['title_' + appStore.language] : ''))
function onDisplayMenuPermission(row) {
  displayMenuPermission.value = true
  selectMenu.value = row
  // console.log(selectMenu)
}
</script>

<style scoped lang="scss">
.router-icon {
  min-width: 23px;
  min-height: 23px;
  display: flex;
  justify-content: center;
  color: #606266;
}
.router-icon:hover {
  color: #007aff;
  cursor: pointer;
}
</style>

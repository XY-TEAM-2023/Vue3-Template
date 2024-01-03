<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <el-card style="width: 260px" class="unselect">
      <!--  标题  -->
      <template #header>
        <div style="display: flex" class="flex-left-center">
          <ui-svg :svg-code="svgCode_title" svg-size="20" svg-color="#3259ce" />
          <span style="margin: 2px 0 0 4px">
            {{ $t('roleMenuConfigView.title') }}
          </span>
        </div>
      </template>

      <!--  内容  -->
      <el-tree
        ref="uiTree"
        class="role"
        :data="treeData"
        :empty-text="isEdit ? $t('roleMenuConfigView.noMenusFull') : $t('roleMenuConfigView.noMenus')"
        :current-node-key="selectMenu.value ? selectMenu.value.id : ''"
        node-key="id"
        :show-checkbox="isEdit"
        :default-checked-keys="menuChecked"
        :draggable="isEdit"
        highlight-current
        default-expand-all
        check-strictly
        :expand-on-click-node="false"
        @current-change="onChangeSelect"
        @check-change="onChangeChecked"
        style="min-height: 200px"
      >
        <template #default="{ node, data }">
          <div>
            <span v-if="data.status === 1" style="margin: 3px 1px 0 -3px">
              <ui-svg :svg-code="svgLock" size="16" svg-color="#606266" />
            </span>
            <span>
              {{ getTitle(data) }}
            </span>
          </div>
        </template>
      </el-tree>

      <!--  底部  -->
      <template #footer>
        <div style="width: 100%; padding: 4px 4px 4px 4px; display: flex">
          <el-button v-if="!isEdit" size="small" type="primary" @click="onEdit">
            {{ $t('com.btnEdit') }}
          </el-button>
          <template v-else>
            <el-button size="small" @click="onCancelEdit" type="danger">
              {{ $t('com.btnCancel') }}
            </el-button>
            <el-button :disabled="!isChanged" size="small" style="margin-left: auto" @click="onResetCheck" type="info">
              {{ $t('com.btnReset') }}
            </el-button>
            <el-button :disabled="!isChanged" size="small" @click="onSubmit" type="primary">
              {{ $t('com.btnApply') }}
            </el-button>
          </template>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import UiSvg from '@/ui/components/UiSvg.vue'
import { request_role_menu_edit, request_role_menu_list } from '@/api/role_menu'
import { cloneDeep } from 'lodash-es'

const appStore = useAppStore()
if (appStore.pageNum_userList <= 0) {
  appStore.pageNum_userList = appStore.pageSizes[0]
}

const userStore = useUserStore()

/*************************************************************
 *                    页面基础数据
 *************************************************************/
const uiTree = ref(null)
const svgCode_title =
  '<svg t="1704190174941" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="40161" width="32" height="32"><path d="M896 256H128V128h768v128z m0 192H128v128h768V448z m0 320H128v128h768V768z" p-id="40162"></path></svg>'
const svgCode_apply =
  '<svg t="1704197554527" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="47220" width="32" height="32"><path d="M896 64 128 64C92.672 64 64 92.672 64 128l0 768c0 35.392 28.672 64 64 64l768 0c35.392 0 64-28.608 64-64L960 128C960 92.672 931.392 64 896 64zM733.632 356.16l-223.36 358.784c-7.744 12.416-21.248 20.224-35.904 20.928C473.792 736 473.024 736 472.384 736c-14.016 0-27.136-6.592-35.648-17.664L292.608 537.472C277.696 517.888 281.6 489.856 301.248 474.944 320.96 460.096 348.864 464 363.712 483.584l105.088 129.152 189.248-303.744c12.992-20.928 40.512-27.264 61.376-14.272C740.352 307.712 746.624 335.232 733.632 356.16z" fill="#020202" p-id="47221"></path></svg>'

const props = defineProps({
  roleId: Number,
})
const roleId = ref(props.roleId)
const isEdit = ref(false)
watch(
  () => [props.roleId],
  ([newId], [oldId]) => {
    if (newId !== oldId) {
      isEdit.value = false
      roleId.value = newId
      requestMenus()
    }
  },
  { deep: true }
)

function getTitle(menu) {
  return menu['title_' + appStore.language]
}

/*************************************************************
 *                      请求页面数据
 *************************************************************/

const isRequestingMenu = ref(false)
/** 修改后的菜单选择状态 */
const menuChecked = ref(reactive([]))
/** 展示的数据 */
const treeData = ref(reactive([]))
/** 原始数据-全部菜单 */
let treeDataFull = []
/** 原始数据-有权限的菜单id列表 */
let treeDataCheckIds = []
/** 原始数据-有权限的菜单数据列表 */
let treeDataHas = []
function requestMenus() {
  if (roleId.value < 0 || isRequestingMenu.value) {
    return
  }
  isRequestingMenu.value = true
  request_role_menu_list(roleId.value)
    .then((data) => {
      treeDataFull = data.result
      const hasItems = collectDataWithHasTrue(data.result)
      treeDataHas = hasItems.tree
      treeDataCheckIds = hasItems.ids
      treeData.value = cloneDeep(treeDataHas)
      menuChecked.value = cloneDeep(treeDataCheckIds)
    })
    .catch(() => {})
    .finally(() => {
      isRequestingMenu.value = false
    })
}

/**
 * 返回所有 has 属性为 true 的项的 id 列表
 */
function collectDataWithHasTrue(items) {
  let ids = []
  let tree = []

  function traverse(items) {
    for (let item of items) {
      if (item.has) {
        ids.push(item.id)
        tree.push(item)
      }
      if (item.children && item.children.length > 0) {
        traverse(item.children)
      }
    }
  }

  traverse(items)
  return { ids, tree }
}

function onEdit() {
  isEdit.value = true
  treeData.value = cloneDeep(treeDataFull)
}

function onCancelEdit() {
  isEdit.value = false
  onResetCheck()
  treeData.value = cloneDeep(treeDataHas)
}

/*************************************************************
 *                      数据是否变化
 *************************************************************/

const isChanged = ref(false)
function onChangeChecked() {
  // menuCheckedSave
  menuChecked.value = uiTree.value.getCheckedKeys()
  isChanged.value = !arraysEqual(menuChecked.value, treeDataCheckIds)
  console.log(isChanged.value)
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

const isReqSaving = ref(false)
function onSubmit() {
  // console.log(menuChecked.value)
  // console.log(treeData.value)
  // console.log(filterData(menuChecked.value, treeData.value))
  if (isReqSaving.value) {
    return
  }
  isReqSaving.value = true

  const config = filterData(menuChecked.value, treeData.value)
  request_role_menu_edit(roleId.value, config)
    .then(() => {})
    .catch(() => {})
    .finally(() => {
      isReqSaving.value = false
    })
}
function filterData(selectIds, dataList) {
  let result = []

  function processItem(item) {
    // 深度复制项和其子项
    let newItem = { ...item, children: item.children ? [...item.children] : [] }

    // 过滤子项
    newItem.children = newItem.children.flatMap((child) => processItem(child)).filter((child) => child !== null)

    // 检查当前项是否应保留
    if (selectIds.includes(item.id)) {
      return newItem
    }

    // 如果当前项不保留，但有子项应保留，则提升这些子项
    return newItem.children.length > 0 ? newItem.children : null
  }

  dataList.forEach((item) => {
    let processedItems = processItem(item)
    if (Array.isArray(processedItems)) {
      result.push(...processedItems)
    } else if (processedItems !== null) {
      result.push(processedItems)
    }
  })

  return result
}

function onResetCheck() {
  uiTree.value.setCheckedKeys(treeDataCheckIds, false)
  menuChecked.value = treeDataCheckIds
  treeData.value = cloneDeep(treeDataFull)
  isChanged.value = false
}

/*************************************************************
 *                      选择菜单事件
 *************************************************************/
const selectMenu = ref(reactive({}))
function onChangeSelect(data, node) {
  console.log(data)
  selectMenu.value = data.result
}
</script>

<style scoped lang="scss">
:deep(*, *::before, *::after) {
  font-weight: inherit; // 继承父类
}

.role-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
</style>

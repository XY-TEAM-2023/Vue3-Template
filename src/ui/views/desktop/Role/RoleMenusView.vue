<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <el-card style="width: 260px" class="unselect" shadow="never">
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
        v-loading="isRequestingMenu"
        :data="treeData"
        :empty-text="isEdit ? $t('roleMenuConfigView.noMenusFull') : $t('roleMenuConfigView.noMenus')"
        node-key="id"
        :current-node-key="currentNode"
        :show-checkbox="isEdit"
        :default-checked-keys="menuChecked"
        highlight-current
        default-expand-all
        check-strictly
        :expand-on-click-node="false"
        @current-change="onChangeSelect"
        @check-change="onChangeChecked"
        style="min-height: 200px"
      >
        <template #default="{ node, data }">
          <div style="display: flex">
            <span v-if="data.name === homePageName" style="margin: 3px 1px 0 -3px">
              <ui-svg :svg-code="svgCode_Home" size="16" svg-color="#e6a23c" />
            </span>
            <span>
              {{ getTitle(data) }}
            </span>
          </div>
        </template>
      </el-tree>

      <!--  底部  -->
      <template #footer>
        <div v-loading="isReqSaving" style="width: 100%; padding: 4px 4px 4px 4px; display: flex">
          <template v-if="!isEdit">
            <el-button size="small" type="primary" @click="onEdit">
              {{ $t('com.btnEdit') }}
            </el-button>

            <el-button
              :disabled="(selectMenu.id && selectMenu.id === 0) || selectMenu.name === homePageName"
              v-loading="isChangeHoming"
              size="small"
              type="warning"
              @click="onSetAsHome"
            >
              {{ $t('roleMenuConfigView.setHome') }}
            </el-button>

            <el-button type="info" size="small" :disabled="selectMenu.id === 0" :icon="CaretTop" @click="onChangeSort(true)" />

            <el-button type="info" size="small" :disabled="selectMenu.id === 0" :icon="CaretBottom" @click="onChangeSort(false)" />
          </template>

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
import { computed, defineProps, reactive, ref, watch, nextTick, defineEmits } from 'vue'
import { useAppStore } from '@/stores/app'
import UiSvg from '@/ui/components/UiSvg.vue'
import { cloneDeep } from 'lodash-es'
import { CaretBottom, CaretTop } from '@element-plus/icons-vue'
import { http_post } from '@/utils/axios'

const appStore = useAppStore()
if (appStore.pageNum_userList <= 0) {
  appStore.pageNum_userList = appStore.pageSizes[0]
}

/*************************************************************
 *                    页面基础数据
 *************************************************************/
const uiTree = ref(null)
const svgCode_title =
  '<svg t="1704190174941" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="40161" width="32" height="32"><path d="M896 256H128V128h768v128z m0 192H128v128h768V448z m0 320H128v128h768V768z" p-id="40162"></path></svg>'

const svgCode_Home =
  '<svg t="1704550594313" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5186" width="32" height="32"><path d="M946.5 505L534.6 93.4c-12.5-12.5-32.7-12.5-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-0.1-90.5z" p-id="5187"></path></svg>'

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
const selectMenu = ref(reactive({ id: 0, name: '' }))
const currentNode = computed(() => (selectMenu.value ? selectMenu.value.id : ''))

const isRequestingMenu = ref(false)
/** 修改后的菜单选择状态 */
const menuChecked = ref(reactive([]))
/** 展示的数据 */
const treeData = ref(reactive([]))
const homePageName = ref('')
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
  isEdit.value = false
  isChanged.value = false
  // 拉取角色菜单配置
  http_post('/api/admin/role/menu/list', { role_id: roleId.value }, false)
    .then((data) => {
      // console.log(data)
      homePageName.value = data.homePageName
      treeDataFull = data.parent
      treeDataHas = data.self
      treeDataCheckIds = toMenuIds(treeDataHas)
      treeData.value = cloneDeep(treeDataHas)
      menuChecked.value = cloneDeep(treeDataCheckIds)

      if (selectMenu.value && selectMenu.value.id) {
        const curId = selectMenu.value.id
        selectMenu.value = { id: 0, name: '' }
        nextTick(() => {
          uiTree.value.setCurrentKey(curId)
          // console.error(currentNode.value)
          emit('selectMenu', selectMenu.value)
        })
      }
    })
    .catch(() => {})
    .finally(() => {
      isRequestingMenu.value = false
    })
}
defineExpose({ requestMenus })

/**
 * 返回所有 has 属性为 true 的项的 id 列表
 */
function toMenuIds(items) {
  let ids = []

  function traverse(items) {
    for (let item of items) {
      ids.push(item.id)
      if (item.children && item.children.length > 0) {
        traverse(item.children)
      }
    }
  }

  traverse(items)
  return ids
}

const emit = defineEmits(['start-edit', 'cancel-edit', 'selectMenu'])

function onEdit() {
  isEdit.value = true
  treeData.value = cloneDeep(treeDataFull)
  emit('start-edit')
}

const isChangeHoming = ref(false)
function onSetAsHome() {
  if (isChangeHoming.value) {
    return
  }
  isChangeHoming.value = true
  // 设置主页
  http_post('/api/admin/role/menu/setHome', { role_id: props.roleId, menu_name: selectMenu.value.name }, true)
    .then(() => {})
    .catch(() => {})
    .finally(() => {
      isChangeHoming.value = false
    })
}

function onCancelEdit() {
  isEdit.value = false
  onResetCheck()
  treeData.value = cloneDeep(treeDataHas)
  emit('cancel-edit')
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
  if (isReqSaving.value) {
    return
  }
  isReqSaving.value = true

  const config = filterData(menuChecked.value, treeData.value)
  // 修改角色菜单配置
  http_post('/api/admin/role/menu/edit', { role_id: roleId.value, config: config }, false)
    .then(() => {
      requestMenus()
      emit('cancel-edit')
    })
    .catch(() => {})
    .finally(() => {
      isReqSaving.value = false
    })
}

function filterData(selectIds, dataList) {
  function processItem(item) {
    // 创建一个新对象，只包含 'name' 和 'children'（如果存在）
    let newItem = { name: item.name }
    if (item.children) {
      newItem.children = item.children.flatMap((child) => processItem(child)).filter((child) => child !== null)
      if (newItem.children.length === 0) {
        delete newItem.children // 如果没有子项，删除 'children' 字段
      }
    }

    // 检查当前项是否应保留
    if (selectIds.includes(item.id)) {
      return newItem
    }

    // 如果当前项不保留，但有子项应保留，则提升这些子项
    return newItem.children ? newItem.children : null
  }

  return dataList.flatMap((item) => processItem(item)).filter((item) => item !== null)
}

function onResetCheck() {
  uiTree.value.setCheckedKeys(treeDataCheckIds, false)
  menuChecked.value = treeDataCheckIds
  treeData.value = cloneDeep(treeDataFull)
  isChanged.value = false
}

function onChangeSort(isUp) {
  const findSelectMenu = (menus) => {
    for (let i = 0; i < menus.length; i++) {
      const item = menus[i]
      if (item.name === selectMenu.value.name) {
        if (isUp) {
          if (i === 0) {
            // 最上面的不能动
            return true
          } else {
            const elementToMove = menus.splice(i, 1)[0] // 删除元素并保存到变量中
            menus.splice(i - 1, 0, elementToMove) // 在入元素
          }
        } else {
          if (i + 1 === menus.length) {
            return true
          } else {
            const elementToMove = menus.splice(i, 1)[0] // 删除元素并保存到变量中
            menus.splice(i + 1, 0, elementToMove) // 在入元素
          }
        }
        return true
      }

      if (item.children && item.children.length > 0) {
        const temp = findSelectMenu(item.children)
        if (temp) {
          return true
        }
      }
    }
    return false
  }

  findSelectMenu(treeData.value)
  requestChangeSort()
}

const isReqSorting = ref(false)
function requestChangeSort() {
  if (isReqSaving.value || isReqSorting.value) {
    return
  }
  isReqSaving.value = true
  isReqSorting.value = true

  // 修改角色菜单配置
  http_post('/api/admin/role/menu/edit', { role_id: roleId.value, config: treeData.value }, false)
    .then(() => {
      requestMenus()
    })
    .catch(() => {})
    .finally(() => {
      isReqSaving.value = false
      isReqSorting.value = false
    })
}

/*************************************************************
 *                      选择菜单事件
 *************************************************************/

function onChangeSelect(data, node) {
  console.error('!!!!!!!!!!!!', data)
  selectMenu.value = data
  emit('selectMenu', data)
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

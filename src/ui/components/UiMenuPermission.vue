<template>
  <div v-loading="isRequesting" style="max-width: 1000px">
    <div v-for="({ name, components }, index) in views" :key="name" class="permission-box">
      <!--   页面里的组件   -->
      <span class="unselect">
        {{ name }}
      </span>
      <el-table
        :data="components"
        border
        size="small"
        :show-header="false"
        :span-method="tryDisplayGroupLine"
        :row-class-name="getCellClassName"
        style="margin-top: 4px"
      >
        <el-table-column align="center" width="80">
          <template #default="scope">
            {{ scope.row.permission }}
          </template>
        </el-table-column>

        <!--  父组件标题  -->
        <el-table-column align="center" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.isHeader ? $t('uiMenuPermission.parentTitle') : getParentTitle(scope.row) }}
          </template>
        </el-table-column>

        <!--  当前组件标题  -->
        <el-table-column align="center" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.isHeader ? $t('uiMenuPermission.displayTitle') : getTitle(scope.row) }}
          </template>
        </el-table-column>

        <!--    组件    -->
        <el-table-column align="center" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="scope.row.isHeader || scope.row.isGroup">
              {{ scope.row.component }}
            </span>
            <component v-else :is="scope.row.component" size="small">
              {{ scope.row.component }}
            </component>
          </template>
        </el-table-column>

        <el-table-column v-if="props.displayEditor" align="center" width="120">
          <template #default="scope">
            <span v-if="scope.row.isHeader">
              {{ scope.row.hasPermission }}
            </span>
            <el-switch
              v-else
              v-model="scope.row.hasPermission"
              size="small"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              @change="onChangePermission(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits, useAttrs } from 'vue'
import { useAppStore } from '@/stores/app'
import i18n from '@/i18n'
import { http_post } from '@/axios'

const props = defineProps({
  // 显示模式: 是否显示修改权限按钮
  displayEditor: {
    type: Boolean,
    default: false,
  },
  // 菜单的名字
  menuName: String,
  // 已拥有的权限, 二进制
  hasPermission: {
    type: Number,
    default: 0,
  },
  // 角色ID, displayEditor 为true时必须有值
  roleId: {
    type: Number,
    default: 0,
  },
})

watch(
  () => [props.menuName, props.hasPermission],
  ([newMenuName, newHasPermission], [oldMenuName, oldHasPermission]) => {
    if (newMenuName !== oldMenuName) {
      if (newMenuName === '') {
        views.value = []
        return
      }
      requestMenuPermissions()
    }
    if (newHasPermission !== oldHasPermission) {
      requestMenuPermissions()
    }
  },
  { deep: true }
)

const isRequesting = ref(false)
const views = ref(reactive([]))
/** 请求菜单所有权限 */
function requestMenuPermissions() {
  if (!props.menuName) {
    return
  }
  if (isRequesting.value) {
    return
  }
  isRequesting.value = true
  //拉取组件权限配置
  http_post('/api/admin/menu/permission/get', { name: props.menuName }, false)
    .then((data) => {
      data = data ? data : {}
      // console.log('请求菜单所有权限', data)
      views.value = []

      const tempViews = []
      tempViews.push({
        name: i18n.global.t('uiMenuPermission.view'),
        components: data.view ? convertData(JSON.parse(data.view)) : [],
      })

      if (data && data.subView) {
        const subViewTemp = JSON.parse(data.subView)
        subViewTemp.forEach((item) => {
          if (item.view.length > 0) {
            tempViews.push({
              name: i18n.global.t('uiMenuPermission.includeView'),
              components: convertData(item.view),
            })
          }
        })
      }
      views.value = tempViews

      // console.log('>>>>>>>>>>', views.value)
    })
    .catch(() => {})
    .finally(() => {
      isRequesting.value = false
    })
}
onMounted(() => {
  requestMenuPermissions()
})

const emit = defineEmits(['updatePermission'])

const appStore = useAppStore()
function getTitle(data) {
  return data.title[appStore.language]
}

function getParentTitle(data) {
  if (data.parent_title) {
    return data.parent_title[appStore.language]
  } else {
    return ''
  }
}

/** 检查组件的权限状态 */
function checkComponentHasPermission(comPermission) {
  // console.log('组件权限', comPermission)
  // console.log('组件权限-二进制', 1 << parseInt(comPermission))
  // console.log('当前权限', props.hasPermission)
  // console.log('组件权限-取值', props.hasPermission & (1 << parseInt(comPermission)))
  return (props.hasPermission & (1 << parseInt(comPermission))) !== 0
}

function convertData(data) {
  let group_name = '' // 分组名
  const result = []

  // console.error('>>>>>>>>>>>>>>>>>', data)
  for (const item of data) {
    // console.log('!!!! ', item)
    if (item.parents && item.parents.some((parent) => parent.includes('el-table'))) {
      // 如果当前数据是表格模式
      if (group_name !== 'el-table') {
        result.push({ isGroup: true, permission: i18n.global.t('uiMenuPermission.tableGroup') })
        result.push({
          isHeader: true,
          permission: i18n.global.t('uiMenuPermission.permission'),
          component: i18n.global.t('uiMenuPermission.components'),
          title: i18n.global.t('uiMenuPermission.displayTitle'),
          hasPermission: i18n.global.t('uiMenuPermission.status'),
        })
        group_name = 'el-table'
      }
    } else {
      // 如果当前数据不是表格模式
      if (group_name !== 'components') {
        result.push({ isGroup: true, permission: i18n.global.t('uiMenuPermission.componentGroup') })
        result.push({
          isHeader: true,
          permission: i18n.global.t('uiMenuPermission.permission'),
          component: i18n.global.t('uiMenuPermission.components'),
          title: i18n.global.t('uiMenuPermission.displayTitle'),
          hasPermission: i18n.global.t('uiMenuPermission.status'),
        })
        group_name = 'components'
      }
    }

    // 计算是否权限
    item.hasPermission = checkComponentHasPermission(item.permission)
    // console.log(props.hasPermission, item.hasPermission, item)

    result.push(item) // 添加当前数据
  }
  return result
}

function tryDisplayGroupLine({ row, column, rowIndex, columnIndex }) {
  if (row.isGroup) {
    if (columnIndex === 0) {
      return {
        rowspan: 1,
        colspan: props.displayEditor ? 5 : 4,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

function getCellClassName({ row }) {
  if (row.isGroup) {
    return 'success-row'
  } else if (row.isHeader) {
    return 'title'
  }
  return ''
}

function onChangePermission(data) {
  console.log(data)
  if (data.isRequesting) {
    return
  }
  data.isRequesting = true
  let newPermission
  if (data.hasPermission) {
    newPermission = props.hasPermission | (1 << data.permission)
  } else {
    newPermission = props.hasPermission & (0 << data.permission)
  }

  // 修改角色某个页面的权限
  http_post('/api/admin/role/menu/updatePermission', { role_id: props.roleId, menu_name: props.menuName, permission: newPermission }, true)
    .then(() => {
      emit('updatePermission')
    })
    .catch(() => {
      data.hasPermission = !data.hasPermission
    })
    .finally(() => {
      data.isRequesting = false
    })
}
</script>

<style scoped lang="scss">
.permission-box + .permission-box {
  margin-top: 10px;
}

:deep(.success-row) {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
  --el-table-row-hover-bg-color: var(--el-color-warning-light-9);
}

:deep(.title) {
  --el-table-tr-bg-color: rgb(245, 247, 250);
  --el-table-row-hover-bg-color: rgb(245, 247, 250);
}
</style>

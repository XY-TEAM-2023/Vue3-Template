<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <!-- 添加 height: 100%; -->
    <div style="margin-bottom: 10px">
      <!--   初始化   -->
      <el-button type="primary" v-loading="isInitializing" @click="onInitRouter">
        {{ $t('routerListView.btnInit') }}
      </el-button>
    </div>

    <!--  目录还是文件  -->
    <el-table-ex v-loading="isRequestingBase" :data="routerConfig" :show-select="true" row-key="name" :show-pagination="false">
      <el-table-column :label="$t('routerListView.type')" align="center" width="100">
        <template #default="scope">
          <!--          <el-tag v-if="scope.row.is_main" style="width: 70px" type="success" effect="dark">-->
          <!--            {{ $t('routerListView.homePage') }}-->
          <!--          </el-tag>-->
          <el-tag v-if="scope.row.component" :style="tagStyle" type="warning" effect="dark">
            {{ $t('routerListView.view') }}
          </el-tag>
          <el-tag v-else type="info" :style="tagStyle" effect="dark">
            {{ $t('routerListView.directory') }}
          </el-tag>
        </template>
      </el-table-column>

      <!--   名字  -->
      <el-table-column prop="name" align="left" :label="$t('routerListView.name')" width="120" />

      <!--  组件图标  -->
      <el-table-column prop="meta.icon" align="center" :label="$t('routerListView.icon')" width="70">
        <template #default="scope">
          <div v-if="scope.row.icon" class="router-icon" @click="onSelectIcon(scope.$index)">
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
        @edit="onEditText('en')"
      />

      <!--   韩文标题  -->
      <el-table-column-label
        prop="title_ko"
        align="center"
        label="routerListView.korean"
        width="160"
        edit-clearable
        @edit="onEditText('ko')"
      />

      <!--   中文标题  -->
      <el-table-column-label
        prop="title_zh"
        align="center"
        label="routerListView.chinese"
        width="160"
        edit-clearable
        @edit="onEditText('zh')"
      />

      <!--   是否显示   -->
      <el-table-column align="center" width="90" :label="$t('routerListView.display')">
        <template #default="scope">
          <el-switch
            v-model="scope.row.display"
            :active-value="1"
            :inactive-value="0"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="onChangeDisplay(scope.row)"
          />
        </template>
      </el-table-column>

      <!--   是否缓存   -->
      <el-table-column align="center" width="90" :label="$t('routerListView.cache')">
        <template #default="scope">
          <el-switch
            v-model="scope.row.cache"
            :active-value="1"
            :inactive-value="0"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="onChangeCache(scope.row)"
          />
        </template>
      </el-table-column>

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
      <el-table-column :label="$t('com.handler')" align="center" width="100">
        <template #default="scope">
          <!--  删除  -->
          <el-button type="danger" size="small" @click="onDeleteRoute(scope.row)">
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import ElTableEx from '@/ui/components/ElTableEx.vue'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import UiSvg from '@/ui/components/UiSvg.vue'
import {
  request_router_base,
  request_router_edit_cache,
  request_router_edit_component,
  request_router_edit_delete,
  request_router_edit_display,
  request_router_edit_icon,
  request_router_edit_title,
  request_router_init,
  request_router_set_home,
} from '@/api/router'
import ElDialogSelectIcon from '@/ui/components/ElDialogSelectIcon.vue'
import { getTextListMaxWidth } from '@/utils'
import ElTableColumnLabel from '@/ui/components/ElTable/ElTableColumnLabel.vue'

const tagStyle = computed(() => {
  return {
    width: getTextListMaxWidth([i18n.global.t('routerListView.view'), i18n.global.t('routerListView.directory')]) + 10 + 'px',
  }
})

let acorn = null
let walk = null
let escodegen = null
onMounted(async () => {
  acorn = await import('acorn')
  walk = await import('acorn-walk')
  escodegen = await import('escodegen')
  // 此处添加解析 JavaScript 文件的代码
})

const routerConfig = ref(reactive([]))
const isRequestingBase = ref(false)
function requestRouterBase(isClick) {
  if (isRequestingBase.value) {
    return
  }
  isRequestingBase.value = true
  request_router_base(isClick)
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
  console.log(icon)
  if (Array.isArray(icon)) {
    return false
  }
  return !icon.includes('.')
}

const isInitializing = ref(false)
let fileDict = {}

/**
 * 初始化路由配置
 */
async function onInitRouter() {
  if (isInitializing.value) {
    return
  }
  isInitializing.value = true

  try {
    const handle = await window.showDirectoryPicker()
    fileDict = await getAllFiles(handle)
    // console.log(fileDict)
    await parseRouterConfig()
  } catch {
    /* empty */
  }

  isInitializing.value = false
}

// 加载文件字典
async function getAllFiles(handle, parentFullPath = '', result = {}) {
  if (handle.kind === 'file') {
    return
  }
  // 迭代器
  const iter = await handle.entries()
  for await (const entry of iter) {
    const fileName = entry[0]
    if (fileName.startsWith('.') || fileName === 'dist' || fileName === 'node_modules') {
      continue
    }
    const filePath = parentFullPath ? parentFullPath + '/' + fileName : fileName
    const fileHandle = entry[1]
    result[filePath] = fileHandle

    await getAllFiles(fileHandle, filePath, result)
  }

  return result
}

// 解析路由配置
async function parseRouterConfig() {
  /** 解析动态路由 */
  const parseAsyncRouteList = (routes) => {
    return routes.reduce((acc, route) => {
      const hasMeta = route.meta
      const hasPublic = hasMeta && route.meta.public

      // 提取当前路由的信息
      const routeInfo = {
        name: route.name,
        title: hasMeta ? route.meta.title : '',
        icon: hasMeta ? route.meta.icon : '',
        desktop: hasPublic ? route.meta.public.desktop : false,
        mobile: hasPublic ? route.meta.public.mobile : false,
        component: route.component || '',
        display: hasMeta ? !route.meta.hidden : false,
        cache: hasMeta ? route.meta.cache : false,
      }

      acc.push(routeInfo)

      // 如果存在子路由，递归处理
      if (route.children && route.children.length > 0) {
        const childRoutes = parseAsyncRouteList(route.children)
        acc.push(...childRoutes)
      }

      return acc
    }, [])
  }

  /** 不改变原始结构的情况下，只保留 name 字段 */
  const retainNameField = (obj) => {
    if (Array.isArray(obj)) {
      // 如果是数组，递归处理每个元素
      return obj.map(retainNameField)
    } else if (typeof obj === 'object' && obj !== null) {
      // 如果是对象，创建一个新对象，只保留 name 字段
      let newObj = {}
      if (obj.name) {
        newObj['name'] = obj['name']
      }

      // 对象的每个属性（如果是对象或数组）也递归处理
      if (obj.children && typeof obj.children === 'object') {
        newObj['children'] = retainNameField(obj.children)
      }
      return newObj
    }
    // 非对象或数组的值直接返回
    return obj
  }

  const fileHandle = fileDict['src/router/config.js']
  if (!fileHandle) {
    console.error('错误的项目路径')
    return
  }

  const file = await fileHandle.getFile()
  const fileReader = new FileReader()
  fileReader.onload = (e) => {
    // 假设 fileContent 是从文件中读取的 JavaScript 代码
    const fileContent = e.target.result
    // console.log(fileContent)

    // 解析 JavaScript 代码为 AST
    const ast = acorn.parse(fileContent, { sourceType: 'module', ecmaVersion: 2020 })

    // 准备一个变量来存储 asyncRoutesNode
    let asyncRoutesNode = null

    // 遍历 AST
    walk.simple(ast, {
      ExportNamedDeclaration(node) {
        if (node.declaration && node.declaration.declarations) {
          for (const declaration of node.declaration.declarations) {
            if (declaration.id.name === 'asyncRoutes') {
              // 找到 asyncRoutes 的定义
              asyncRoutesNode = declaration.init
              // 在这里，asyncRoutes 是一个 AST 节点
            }
          }
        }
      },
    })

    // 输出 asyncRoutes（注意：这将是 AST 节点，而不是实际的数组）
    // console.log(asyncRoutesNode)

    // 将 AST 节点转换回代码字符串
    let code = escodegen.generate(asyncRoutesNode)
    // 替换动态字符${platform}
    code = code.replace(/\$\{\s*platform\s*\}/g, '{platform}')
    // console.log(code)

    // 使用 eval 执行代码
    try {
      let asyncRoutes = eval(code)
      // console.log(asyncRoutes) // 这里的 asyncRoutes 将是实际的数组

      const router_list = parseAsyncRouteList(asyncRoutes)
      const router_config = retainNameField(asyncRoutes) // parseAsyncRoute_Config(asyncRoutes)
      console.log(router_config)

      requestRouterInit(router_list, router_config)
    } catch (error) {
      console.error('执行代码失败', error)
    }
  }
  fileReader.readAsText(file)
}

function requestRouterInit(router_list, router_config) {
  let router_list_data = []
  router_list.forEach((item) => {
    router_list_data.push({
      name: item.name,
      icon: item.icon,
      title: item.title,
      title_en: i18n.global.t(item.title, 'en'),
      title_zh: i18n.global.t(item.title, 'zh'),
      title_ko: i18n.global.t(item.title, 'ko'),
      enable_desktop: item.desktop ? 1 : 0,
      enable_mobile: item.mobile ? 1 : 0,
      component: item.component ? item.component : '',
      display: item.display ? 1 : 0,
      cache: item.cache ? 1 : 0,
    })
  })

  // console.log(routerConfig)
  request_router_init(router_list_data, router_config)
    .then(() => {
      requestRouterBase(false)
    })
    .catch(() => {})
    .finally(() => {
      isInitializing.value = false
    })
}

/*******************************************************************
                                修改数据相关
 ******************************************************************/
function onEditText(local) {
  return (index, row, newValue, cancelCb, closeCb) => {
    request_router_edit_title(row.id, newValue, local)
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
  request_router_edit_component(row.id, newValue)
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
  request_router_edit_display(row.id, row.display)
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
  request_router_edit_cache(row.id, row.cache)
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

  request_router_edit_icon(routerConfig.value[selectIconIndex].id, icon)
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
      request_router_set_home(obj.id)
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
      request_router_edit_delete(obj.id)
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

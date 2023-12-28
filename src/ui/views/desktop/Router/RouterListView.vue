<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <!-- 添加 height: 100%; -->
    <div style="margin-bottom: 10px">
      <!--   初始化   -->
      <el-button type="primary" v-loading="isInitializing" @click="onInitRouter">
        {{ $t('routerListView.btnInit') }}
      </el-button>
    </div>

    <el-table-ex v-loading="isRequestingBase" :data="routerConfig" :show-select="true" row-key="name" :show-pagination="false">
      <el-table-column prop="name" align="left" :label="$t('routerListView.name')" width="150" />

      <!--  组件图标  -->
      <el-table-column prop="meta.icon" align="center" :label="$t('routerListView.icon')" width="80">
        <template #default="scope">
          <div v-if="scope.row.icon" class="router-icon">
            <component v-if="isElementIcon(scope.row.icon)" :is="scope.row.icon" style="width: 23px; height: 23px" />
            <ui-svg v-else size="23px" :svg-path="scope.row.icon" svg-color="#606266" />
          </div>
        </template>
      </el-table-column>

      <!--  英文  -->
      <el-table-column align="center" :label="$t('routerListView.english')" width="160" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button link @click="onEditText_Title(scope.row, 'en')">
            {{ scope.row.title_en }}
          </el-button>
        </template>
      </el-table-column>
      <!--  韩文  -->
      <el-table-column align="center" :label="$t('routerListView.korean')" width="160" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button link @click="onEditText_Title(scope.row, 'ko')">
            {{ scope.row.title_ko }}
          </el-button>
        </template>
      </el-table-column>

      <!--  中文  -->
      <el-table-column align="center" :label="$t('routerListView.chinese')" width="160" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button link @click="onEditText_Title(scope.row, 'zh')">
            {{ scope.row.title_zh }}
          </el-button>
        </template>
      </el-table-column>

      <!--   是否显示   -->
      <el-table-column align="center" width="100" :label="$t('routerListView.display')">
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
      <el-table-column align="center" width="100" :label="$t('routerListView.cache')">
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

      <!--  文件路径  -->
      <el-table-column align="left" :label="$t('routerListView.filePath')" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button link @click="onEditText_Component(scope.row)">
            {{ scope.row.component }}
          </el-button>
        </template>
      </el-table-column>

      <!--  删除按钮  -->
      <el-table-column :label="$t('com.handler')" align="center" width="100">
        <template #default="scope">
          <el-button type="danger" size="small" @click="onDelete(scope.row)">
            {{ $t('com.btnDelete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table-ex>

    <el-dialog-input
      :is-show="textDialog.isShow"
      :title="textDialog.title"
      :width="textDialog.width"
      :default-value="textDialog.defaultValue"
      :placeholder="textDialog.placeholder"
      :clearable="textDialog.clearable"
      @close="textDialog.isShow = false"
      @submit="textDialog.onSubmitCb"
    />

    <el-dialog-select-icon :is-show="true" />
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import ElTableEx from '@/ui/components/ElTableEx.vue'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import UiSvg from '@/ui/components/UiSvg.vue'
import {
  request_router_base,
  request_router_edit_cache,
  request_router_edit_component,
  request_router_edit_display,
  request_router_edit_title,
  request_router_init,
} from '@/api/router'
import ElDialogInput from '@/ui/components/ElDialogInput.vue'
import { config } from '@/config'
import ElDialogSelectIcon from '@/ui/components/ElDialogSelectIcon.vue'

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
  return !icon.includes('.')
}

/**
 * 显示编辑I18n文本窗口
 */
function onEditI18nLabel(path, local) {
  ElMessageBox.prompt(i18n.global.t('app.editI18nLabel'), '', {
    confirmButtonText: i18n.global.t('com.btnOk'),
    cancelButtonText: i18n.global.t('com.btnCancel'),
    inputValue: path,
  })
    .then(({ value }) => {
      console.log(local, value)
    })
    .catch(() => {})
}

function onEditFilePath(obj) {
  console.log(obj)
  ElMessageBox.prompt('', '', {
    confirmButtonText: i18n.global.t('com.btnOk'),
    cancelButtonText: i18n.global.t('com.btnCancel'),
    inputValue: i18n.global.t(toString(obj.component)),
  })
    .then(({ value }) => {
      obj.component = value
    })
    .catch(() => {})
}

function onDelete(obj) {
  console.log(obj)
  console.log('是否确定删除')
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
  const parseAsyncRoutes = (routes) => {
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
        const childRoutes = parseAsyncRoutes(route.children)
        acc.push(...childRoutes)
      }

      return acc
    }, [])
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

      const final = parseAsyncRoutes(asyncRoutes)
      // console.log(final)

      requestRouterInit(final)
    } catch (error) {
      console.error('执行代码失败', error)
    }
  }
  fileReader.readAsText(file)
}

function requestRouterInit(routerConfig) {
  let requestData = []
  routerConfig.forEach((item) => {
    requestData.push({
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
  request_router_init(requestData)
    .then((data) => {
      console.log(data)
      requestRouterBase()
    })
    .catch(() => {})
    .finally(() => {
      isInitializing.value = false
    })
}

/*******************************************************************
                                修改数据相关
 ******************************************************************/
const textDialog = reactive({
  isShow: false,
  title: '',
  width: '300',
  defaultValue: '',
  placeholder: '',
  clearable: true,
  onSubmitCb: null,
})

/**
 * 修改文本类型数据
 */
function onEditText_Title(row, local) {
  textDialog.title = 'routerListView.changeTitle'
  if (local === 'en') {
    textDialog.defaultValue = row.title_en
  } else if (local === 'zh') {
    textDialog.defaultValue = row.title_zh
  } else if (local === 'ko') {
    textDialog.defaultValue = row.title_ko
  }
  textDialog.width = '350'
  textDialog.onSubmitCb = (newValue) => {
    request_router_edit_title(row.id, newValue, local)
      .then(() => {
        requestRouterBase(false)
        textDialog.isShow = false
      })
      .catch(() => {})
      .finally(() => {})
  }
  textDialog.isShow = true
}

/**
 * 修改文件路径
 */
function onEditText_Component(row) {
  textDialog.title = 'routerListView.changeComponent'
  textDialog.defaultValue = row.component
  textDialog.width = '500'
  textDialog.onSubmitCb = (newValue) => {
    request_router_edit_component(row.id, newValue)
      .then(() => {
        requestRouterBase(false)
        textDialog.isShow = false
      })
      .catch(() => {})
      .finally(() => {})
  }
  textDialog.isShow = true
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

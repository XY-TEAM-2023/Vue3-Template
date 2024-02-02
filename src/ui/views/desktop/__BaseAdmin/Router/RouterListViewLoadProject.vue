<template>
  <el-button type="warning" @click="onLoad">
    {{ $t('routerListView.btnLoadProject') }}
  </el-button>
</template>

<script setup>
import { defineEmits, computed, ref, onMounted } from 'vue'

const emit = defineEmits(['loaded'])

let loading = false
let isLoaded = ref(false)
let fileDict = {}

const title = computed(() => (isLoaded.value ? '重新加载' : '加载项目'))

let acorn = null
let walk = null
let escodegen = null
onMounted(async () => {
  acorn = await import('acorn')
  walk = await import('acorn-walk')
  escodegen = await import('escodegen')
  // 此处添加解析 JavaScript 文件的代码
})

/**
 * 初始化路由配置
 */
async function onLoad() {
  if (loading) {
    return
  }
  loading = true

  try {
    console.error('请使用 127.0.0.1 进行访问')
    const handle = await window.showDirectoryPicker()
    fileDict = await getAllFiles(handle)

    const fileHandle = fileDict['src/router/asyncRoutes.js']

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

      let code = escodegen.generate(asyncRoutesNode) // 将 AST 节点转换回代码字符串
      code = code.replace(/\$\{\s*platform\s*\}/g, '{platform}') // 替换动态字符${platform}
      // console.log(code)

      // 使用 eval 执行代码
      try {
        const asyncRoutes = eval(code)
        const router_list = parseAsyncRouteList(asyncRoutes)

        emit('loaded', fileDict, router_list, asyncRoutes)
        isLoaded.value = true
      } catch (error) {
        console.error('执行代码失败', error)
      } finally {
        loading = false
      }
    }
    fileReader.readAsText(file)
  } catch {
    /* empty */
    loading = false
  }
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

/** 解析动态路由 */
const parseAsyncRouteList = (routes) => {
  return routes.reduce((acc, route) => {
    const hasMeta = route.meta
    const hasPublic = hasMeta && route.meta.public

    // 提取当前路由的信息
    const routeInfo = {
      name: route.name,
      title: hasMeta ? route.meta.title : { zh: 'undefined', en: 'undefined', ko: 'undefined' },
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
</script>

<style scoped lang="scss"></style>

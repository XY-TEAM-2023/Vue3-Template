<template>
  <el-button v-loading="isRequesting" type="primary" :disabled="disabled" @click="onUpdate">
    {{ $t('routerListView.btnUpdatePermission') }}
  </el-button>
</template>

<script setup>
import { ref, reactive, onMounted, computed, defineEmits } from 'vue'
import i18n from '@/i18n'
import { request_menu_permission_update } from '@/api/menu'

const props = defineProps({
  routerList: Array,
  fileDict: Object,
})

const disabled = computed(() => {
  const keys = Object.keys(props.fileDict)
  return !keys || keys.length === 0
})

const emit = defineEmits(['refresh'])

const isRequesting = ref(false)
async function onUpdate() {
  if (isRequesting.value) {
    return
  }
  isRequesting.value = true
  // 假设 router_list 和 fileDict 已经被定义
  console.log(props.routerList)
  console.log(props.fileDict)

  // 加载desktop和mobile的页面代码
  const views = await processRoutes(props.routerList, props.fileDict)
  console.log(views)
  console.log('加载desktop和mobile的页面代码', views)
  // 将view数据转为JSON结构
  let desktop = viewCodeToJson(views.desktop)
  // let mobile = viewCodeToJson(views.mobile)
  console.log('将view数据转为JSON结构', views)
  // 得到页面中定义了权限的组件
  desktop = ViewJsonToPermission(desktop)
  // let mobile = ViewJsonToPermission(views.mobile)
  console.log('得到页面中定义了权限的组件', views)
  // 清理数据
  clearData(desktop)
  console.log('清理数据', desktop)
  // 组织请求数据
  const reqData = []
  desktop.forEach((item) => {
    console.log(item)
    reqData.push({
      name: item.name,
      view: JSON.stringify(item.view),
      subView: JSON.stringify(item.children),
    })
  })
  console.log('组织请求数据', desktop)

  request_menu_permission_update(reqData)
    .then(() => {
      emit('refresh')
    })
    .catch(() => {})
    .finally(() => {
      isRequesting.value = false
    })
}

/** 将view转为JSON格式，如果空为null */
function viewCodeToJson(data) {
  const result = []

  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item.view) {
        item.view = htmlToJson(item.view)
      } else {
        item.view = null
      }

      if (item.children) {
        item.children = viewCodeToJson(item.children)
        if (item.children.length === 0) {
          delete item.children
        }
      }

      result.push({ ...item })
    })
  }

  return result
}

/** 解析view的json结构，得到页面的权限配置 */
function ViewJsonToPermission(data) {
  const result = []

  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item.view) {
        item.view = toPermissionElements(item.view)
      } else {
        item.view = null
      }

      if (item.children) {
        item.children = ViewJsonToPermission(item.children)
        if (item.children.length === 0) {
          delete item.children
        }
      }

      result.push({ ...item })
    })
  }

  return result
}

/**************************************************************************************************
 *                                  加载各个路由页面的代码和导入的组件
 **************************************************************************************************/

// 处理路由列表，为每个路由项提取模板内容
async function processRoutes(routerList, fileDict) {
  let results = { desktop: [], mobile: [] }

  // 遍历路由列表
  for (let route of routerList) {
    if (route.component) {
      // 替换platform并提取模板，分别处理desktop和mobile
      results.desktop.push({
        name: route.name,
        ...(await extractTemplates(route.component.replace('{platform}', 'desktop'), fileDict, true)),
      })
      results.mobile.push({
        name: route.name,
        ...(await extractTemplates(route.component.replace('{platform}', 'desktop'), fileDict, true)),
      })
    }
  }

  return results
}

// 提取Vue文件中的模板内容
async function extractTemplates(componentPath, fileDict, isView, baseDir = '') {
  let templateContents = isView ? { view: '', children: [] } : {}

  // 检查路径是否以'/'开头，并在必要时移除它
  if (componentPath.startsWith('/')) {
    componentPath = componentPath.substring(1)
  }

  if (isView) {
    baseDir = componentPath.split('/').slice(0, -1).join('/') // 设置基本目录为主视图所在目录
  }

  const fileHandle = fileDict[componentPath]
  if (!fileHandle) return templateContents

  const file = await fileHandle.getFile()
  const text = await file.text()
  const templateContent = extractTemplateContent(text)

  if (templateContent) {
    if (isView) {
      templateContents.view = templateContent
    } else {
      templateContents = templateContent
    }

    const importPaths = extractVueImports(text)
    for (let importPath of importPaths) {
      const adjustedPath = adjustImportPath(importPath, componentPath)
      if (isImportWithinAllowedPath(adjustedPath, baseDir)) {
        const childTemplate = await extractTemplates(adjustedPath, fileDict, false, baseDir)
        if (isView) {
          templateContents.children.push({
            name: getFileNameWithoutExtension(adjustedPath),
            view: childTemplate,
          })
        }
      }
    }
  }

  return templateContents
}

function extractTemplateContent(text) {
  const startTag = '<template>'
  const endTag = '</template>\n'
  let startIndex = text.indexOf(startTag)
  let endIndex = text.lastIndexOf(endTag)

  if (startIndex !== -1 && endIndex !== -1) {
    return text.substring(startIndex, endIndex + endTag.length).trim()
  }

  return '' // 没有找到template标签
}

// 从Vue文件内容中提取所有.vue文件的引用路径
function extractVueImports(fileContent) {
  const importRegex = /import .* from ['"](.+\.vue)['"]/g
  let match
  let imports = []

  while ((match = importRegex.exec(fileContent)) !== null) {
    imports.push(match[1])
  }

  return imports
}

// 获取不包含扩展名的文件名
function getFileNameWithoutExtension(filePath) {
  return filePath.split('/').pop().split('.').slice(0, -1).join('.')
}

// 调整引入文件的路径
function adjustImportPath(importPath, basePath) {
  const baseParts = basePath.split('/').slice(0, -1)
  const importParts = importPath.split('/')
  importParts.forEach((part) => {
    if (part === '..') {
      baseParts.pop()
    } else if (part !== '.') {
      baseParts.push(part)
    }
  })
  return baseParts.join('/')
}

// 检查导入的文件是否在允许的路径内（当前目录或上级目录）
function isImportWithinAllowedPath(importPath, baseDir) {
  // 获取导入文件的目录
  const importDir = importPath.split('/').slice(0, -1).join('/')
  // 检查导入文件是否在主视图文件的当前目录或上级目录下
  return importDir === baseDir || importDir === baseDir.split('/').slice(0, -1).join('/')
}

/**************************************************************************************************
 *                                  解析页面为JSON结构
 **************************************************************************************************/
/**
 * 将html代码块解析为json结构
 * @param html
 * @returns {any} 返回具体结构如下
 *
 *  {
 *  	// 标签
 *  	"component": "el-tag",
 *  	// 属性
 *  	"props": {
 *  		"v-permission": "2",
 *  		"v-if": "scope.row.component",
 *  		":style": "tagStyle",
 *  	},
 *  	// 子组件
 *  	"children": [
 *  		// ...和当前结构一致
 *  	],
 *  	// 父级组件
 *  	"parents": [
 *  		"div",
 *  		"el-table-ex",
 *  		"el-table-column",
 *  		"template"
 *  	]
 *  }
 */
function htmlToJson(html) {
  // 预处理Vue特定标签和指令
  function preprocessVueSpecificTags(html) {
    const vueSpecificTags = ['router-link', 'router-view', 'template']
    const vueDirectives = ['v-if', 'v-for', 'v-bind', 'v-model', 'v-on']

    // 替换Vue特定标签，添加前缀'vvvue-'
    vueSpecificTags.forEach((tag) => {
      html = html.replace(new RegExp(`<${tag}`, 'g'), `<vvvue-${tag}`)
      html = html.replace(new RegExp(`</${tag}>`, 'g'), `</vvvue-${tag}>`)
    })

    // 替换Vue指令，添加前缀'vvvue-'
    vueDirectives.forEach((dir) => {
      html = html.replace(new RegExp(`(\\s)${dir}`, 'g'), `$1vvvue-${dir}`)
    })

    // 处理v-bind和v-on的简写形式
    html = html.replace(/(\s):/g, ' vvvue-bind:')
    html = html.replace(/(\s)@/g, ' vvvue-on:')

    return html
  }

  // 移除添加的'vvvue-'前缀，恢复原始Vue格式
  function removeVuePrefix(html) {
    const vueSpecificTags = ['router-link', 'router-view', 'template']
    const vueDirectives = ['v-if', 'v-for', 'v-bind', 'v-model', 'v-on']

    // 移除标签前缀
    vueSpecificTags.forEach((tag) => {
      html = html.replace(new RegExp(`vvvue-${tag}`, 'g'), tag)
    })

    // 移除指令前缀
    vueDirectives.forEach((dir) => {
      html = html.replace(new RegExp(`vvvue-${dir}`, 'g'), dir)
    })

    // 恢复v-bind和v-on的简写形式
    html = html.replace(/vvvue-bind:/g, ':')
    html = html.replace(/vvvue-on:/g, '@')

    return html
  }

  // 转换自闭合标签为常规开闭标签
  function convertSelfClosingTags(html) {
    // 正则表达式匹配所有自闭合标签
    const selfClosingTagRegex = /<(\w+[\w-]*)([^>]*)\/>/g
    // 替换自闭合标签为开闭形式
    return html.replace(selfClosingTagRegex, '<$1$2></$1>')
  }

  // 解析HTML并构建数据结构
  function parseHTML(html) {
    // 使用DOMParser解析处理过的HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // 递归解析每个节点
    const parseNode = (node, parents) => {
      // 处理文本节点
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim()
        return text.length > 0 ? { component: 'text', text, parents } : null
      }

      // 处理元素节点
      if (node.nodeType === Node.ELEMENT_NODE) {
        // 获取并处理元素标签名
        let component = node.tagName.toLowerCase()
        // 移除元素名称中的'vvvue-'前缀
        component = removeVuePrefix(component)

        // 解析并处理元素的属性
        const props = {}
        for (const attr of node.attributes) {
          let name = attr.name
          // 移除属性名称中的'vvvue-'前缀
          name = removeVuePrefix(name)
          props[name] = attr.value
        }

        // 递归解析子节点，更新父级列表
        const children = Array.from(node.childNodes)
          .map((child) => parseNode(child, [...parents, component]))
          .filter((child) => child !== null)

        // 返回节点的结构化表示
        return { component, props, children, parents }
      }

      return null
    }

    // 解析文档的根节点
    return parseNode(doc.body.firstChild, [])
  }

  // 执行预处理、转换自闭合标签、解析HTML、并恢复到原始格式
  html = preprocessVueSpecificTags(html)
  html = convertSelfClosingTags(html)
  let result = parseHTML(html)
  let resultHtml = JSON.stringify(result)

  // 恢复所有标签和指令到原始Vue格式
  resultHtml = removeVuePrefix(resultHtml)
  return JSON.parse(resultHtml)
}

/**************************************************************************************************
 *                                  解析页面JSON结构中的权限
 **************************************************************************************************/
// [
//   {
//     "component": "div",
//     "parents": [
//       "div"
//     ],
//     "permission": 2
//   }
// ]
function toPermissionElements(data) {
  function addParentReferences(data, parent = null) {
    data.parent = parent
    if (data.children && data.children.length > 0) {
      data.children.forEach((child) => addParentReferences(child, data))
    }
  }

  function findElementsWithPermissionKey(data) {
    let elementsWithPermission = []

    if (data.props) {
      for (const key in data.props) {
        const propValue = data.props[key].toString()
        let permissionValue = null

        if (key.startsWith('v-permission')) {
          permissionValue = parseInt(propValue, 10)
        } else {
          const match = propValue.match(/hasPermission\(([^)]+)\)/)
          if (match) {
            const permissionParam = match[1].replace(/['"]/g, '') // 剔除单引号和双引号
            permissionValue = parseInt(permissionParam, 10) // 转换为整数
          }
        }

        if (permissionValue !== null) {
          const { children, ...elementWithoutChildren } = data
          if (children) {
            for (const com of children) {
              if (com.component === 'text') {
                elementWithoutChildren.props.text = com.text
                break
              }
            }
          }
          elementWithoutChildren.permission = permissionValue
          elementsWithPermission.push(elementWithoutChildren)
          break
        }
      }
    }

    if (data.children && data.children.length > 0) {
      data.children.forEach((child) => {
        elementsWithPermission = elementsWithPermission.concat(findElementsWithPermissionKey(child))
      })
    }

    return elementsWithPermission
  }

  function extractI18nKey(str) {
    const match = str.match(/\$t\(['"](.+?)['"]\)/)
    return match ? match[1] : null
  }

  function addTitleToElementsWithLabel(elements) {
    elements.forEach((element) => {
      // 组件标题
      if (element.props) {
        for (const key in element.props) {
          if (key.includes('label') || key.includes('title') || key === 'text') {
            const i18nKey = extractI18nKey(element.props[key])
            element.title = i18nKey ? i18nKey : element.props[key]
            break
          }
        }
      }

      // 父组件标题
      let parentElement = element.parent
      while (parentElement) {
        if (parentElement.props) {
          for (const key in parentElement.props) {
            if (key.includes('label') || key.includes('title')) {
              const i18nKey = extractI18nKey(parentElement.props[key])
              element.parent_title = i18nKey ? i18nKey : parentElement.props[key]
              break
            }
          }
        }
        parentElement = parentElement.parent
      }

      const keys = ['title', 'parent_title']
      for (let i = 0; i < 2; i++) {
        const titleKey = keys[i]
        const titleValue = element[titleKey]
        if (titleValue) {
          element[titleKey] = titleValue.includes('.')
            ? {
                zh: i18n.global.t(titleValue, 'zh'),
                en: i18n.global.t(titleValue, 'en'),
                ko: i18n.global.t(titleValue, 'ko'),
              }
            : {
                zh: titleValue,
                en: titleValue,
                ko: titleValue,
              }
        }
      }

      delete element.parent // 移除parent字段
    })
  }

  addParentReferences(data)
  const elementsWithPermission = findElementsWithPermissionKey(data)
  addTitleToElementsWithLabel(elementsWithPermission)

  return elementsWithPermission
}

/**************************************************************************************************
 *                                  清除多余的字段
 **************************************************************************************************/
function clearData(data) {
  data.forEach((item) => {
    clearDataHandler(item)
  })
}

// 计算一个view的权限
function clearDataHandler(data) {
  if (!data.view) {
    data.view = []
  }
  data.view.forEach((component) => {
    delete component.props
    if (!component.title) {
      component.title = {
        zh: '———',
        en: '———',
        ko: '———',
      }
    }
    if (!component.parent_title) {
      component.parent_title = {
        zh: '———',
        en: '———',
        ko: '———',
      }
    }

    if (component.parents && component.parents.length > 0) {
      if (component.parents[component.parents.length - 1] === 'template') {
        component.parents.splice(component.parents.length - 1, 1)
      }
    }
  })

  // 计算页面引用的其他页面权限
  if (data.children) {
    data.children.forEach((item) => {
      clearDataHandler(item)
    })
  }
}
</script>

<style scoped lang="scss"></style>

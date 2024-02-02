import './styles/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist' // pinia数据持久化
import i18n from './i18n' // 导入多语言配置
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'
import { config } from '@/config'
import menu from '@/ui/components/Menu/v-menu'
import { hasPermission } from '@/utils'
import { useUserStore } from '@/stores/user'

router.reloadRoutes()
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersist)
app.use(pinia)
app.use(i18n)
app.use(router)
app.directive('menu', menu)
app.use(ElementPlus)
// 注册所有 Element Plus 图标
for (const iconName in ElIconModules) {
  // console.log(iconName)
  config.elementPlusIconNames.push(iconName)
  app.component(iconName, ElIconModules[iconName])
}

// 注册指令: 元素是否可见, 需要开发者权限
app.directive('dev', {
  mounted(el) {
    if (!useUserStore().isDev) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  },
})

// 注册指令: 元素是否可见。值针对页面唯一
app.directive('permission', {
  mounted(el, binding) {
    // 检查权限
    const permissionValue = binding.value
    if (!hasPermission(permissionValue)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  },
})

// 注册指令：是否可以触发鼠标事件。值针对页面唯一
app.directive('permission-event', {
  mounted(el, binding) {
    if (!hasPermission(binding.value)) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((newNode) => {
            console.log(newNode)
            if (newNode.nodeType === Node.ELEMENT_NODE) {
              lockElementEvent(newNode)
            }
          })
        })
      })

      observer.observe(el, { childList: true, subtree: true })
      lockElementEvent(el)
      // console.log('>>>>>>', el)
      el.querySelectorAll('*').forEach((child) => {
        // console.log(child)
        disableElement(child)
      })

      // 清理
      el._permissionEventObserver = observer
    }
  },
  unmounted(el) {
    // 清除事件监听器
    el.removeEventListener('click', preventClick, true)
    el.removeEventListener('contextmenu', preventClick, true)

    // 断开观察器
    if (el._permissionEventObserver) {
      el._permissionEventObserver.disconnect()
    }
  },
})

function lockElementEvent(el) {
  el.addEventListener('click', preventClick, true)
  el.addEventListener('contextmenu', preventClick, true)
  el.style.cursor = 'default' // 更改鼠标样式
}

// 注册指令：无权限时候置灰且无法触发点击事件。值针对页面唯一
app.directive('permission-enable', {
  beforeMount(el, binding) {
    if (!hasPermission(binding.value)) {
      disableElement(el)
      el.querySelectorAll('*').forEach((child) => {
        disableElement(child)
      })
    }
  },
  unmounted(el) {
    // 清除事件监听器
    el.removeEventListener('click', preventClick, true)
    el.removeEventListener('contextmenu', preventClick, true)
  },
})

function disableElement(element) {
  // 置灰样式
  element.style.opacity = '0.8'
  element.style.pointerEvents = 'none' // 禁止鼠标事件
  element.style.cursor = 'not-allowed' // 鼠标悬浮时的禁止图标
}

function preventClick(e) {
  e.stopPropagation()
  e.preventDefault()
}

app.mount('#app')
i18n.global.init()

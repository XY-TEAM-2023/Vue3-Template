import './styles/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist' // pinia数据持久化
import i18n from './i18n' // 导入多语言配置
import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'
import { config } from '@/config'

router.reloadRoutes()
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersist)
app.use(pinia)
app.use(i18n)
app.use(router)

// 如果是管理后台, 全局引用
if (config.websiteModel === 'admin') {
  app.use(ElementPlus)

  // 注册所有 Element Plus 图标
  for (const iconName in ElIconModules) {
    // console.log(iconName)
    config.elementPlusIconNames.push(iconName)
    app.component(iconName, ElIconModules[iconName])
  }
}

app.directive('permission', {
  mounted(el, binding) {
    // 检查权限
    const permissionValue = binding.value
    if (!checkPermission(permissionValue)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  },
})

app.mount('#app')
i18n.global.init()

let userStore = null

function checkPermission(value) {
  if (!userStore) {
    userStore = useUserStore()
  }

  console.log(value)
  return true
}

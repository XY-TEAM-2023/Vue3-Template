import './styles/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist' // pinia数据持久化
import i18n from './i18n' // 导入多语言配置
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import { useUserStore } from '@/stores/user'

router.reloadRoutes()
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersist)
app.use(pinia)
app.use(i18n)
app.use(router)

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

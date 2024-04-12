import '@/styles/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist' // pinia数据持久化
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'
import menu from '@/ui/components/Menu/v-menu'
import { hasPermission } from '@/utils'
import { useUserStore } from '@/stores/user'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersist)
app.use(pinia)
app.directive('menu', menu)
app.use(ElementPlus)

// 注册所有 Element Plus 图标
for (const iconName in ElIconModules) {
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

app.mount('#app')


/****************************************************************
 *              拦截用户按下 F5 键以刷新当前页面
 ****************************************************************/
// 添加全局的键盘事件监听器
window.addEventListener('keydown', handleGlobalKeyDown)

function handleGlobalKeyDown(event) {
  // 拦截 F5 键
  if (event.key === 'F5') {
    event.preventDefault() // 阻止默认行为
  }
  else if (event.key === 'F12') {
    // 阻止浏览器默认行为（如保存网页）
    event.preventDefault();
  }
  else if (event.ctrlKey && event.key === 's') {
    // 阻止浏览器默认行为（如保存网页）
    event.preventDefault();
  }
}

window.addEventListener('contextmenu', (event) => {
  event.preventDefault() // 阻止默认右键菜单
})
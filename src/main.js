import './styles/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist' // pinia数据持久化
import i18n from './i18n' // 导入多语言配置
import App from './App.vue'
import router from './router'

import('./config.js')
  .then(({ websiteModel }) => {
    const app = createApp(App)
    // 只在
    if (websiteModel === 'admin') {
      console.error('?????+++')
      import('element-plus')
        .then((ElementPlus) => {
          import('element-plus/dist/index.css')
          app.use(ElementPlus)
        })
        .catch((error) => {
          console.error('加载 Element Plus 失败:', error)
        })
    } else if (websiteModel === 'website') {
      import('element-plus/dist/index.css')
    }

    router.reloadRoutes()
    const pinia = createPinia()
    pinia.use(piniaPluginPersist)
    app.use(pinia)
    app.use(i18n)
    app.use(router)
    app.mount('#app')
    i18n.global.init()
  })
  .catch((error) => {
    console.error('加载配置文件失败:', error)
  })

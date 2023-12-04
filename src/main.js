import './styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist' // pinia数据持久化
import i18n from './i18n' // 导入多语言配置
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)
app.use(i18n)
app.use(router)
i18n.global.init()

app.mount('#app')

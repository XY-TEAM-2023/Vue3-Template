import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist' // pinia数据持久化

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)

app.use(pinia)
app.use(router)
app.mount('#app')

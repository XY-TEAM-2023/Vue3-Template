import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { config } from './src/config'
import vueGlobals from 'vite-plugin-vue-globals'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 设置 base 为相对路径
  server: {
    proxy: {
      // 匹配所有请求
      '/api': {
        target: config.server, // 目标后端服务地址
        changeOrigin: true, // 确保正确地设置 HTTP 请求头中的 host 字段
        secure: false, // 允许代理到无效 SSL 证书的服务器
      },
    },
  },
  plugins: [
    vue(),
    vueGlobals({
      // 指定你想要全局可用的 Vue API
      vue: ['ref', 'reactive', 'computed', 'watch', 'onMounted', 'onBeforeUnmount', 'defineProps', 'defineEmits', 'defineExpose'],
    }),
    AutoImport({
      // imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

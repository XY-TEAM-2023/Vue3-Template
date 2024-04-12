import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { config } from './src/config'
import vueGlobals from 'vite-plugin-vue-globals'
import legacy from '@vitejs/plugin-legacy'
import { env } from 'eslint-plugin-vue/lib/configs/base'
import viteImagemin from 'vite-plugin-imagemin'
import purgecss from '@fullhuman/postcss-purgecss'
import CompressionWebpackPlugin from 'compression-webpack-plugin'
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  // 使用PurgeCSS插件，可以自动删除不使用的CSS
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          purgecss({
            content: ['./public/**/*.html', './src/**/*.vue'],
            defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
          }),
        ],
      },
    },
  },
  configureWebpack: {
    // 使用Webpack的splitChunks功能，将公共代码抽取成独立的文件，以便浏览器进行缓存
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    plugins: [
      // 使用compression-webpack-plugin插件，可以将生成的文件进行Gzip压缩
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    vue(),
    vueGlobals({
      // 指定你想要全局可用的 Vue API
      vue: ['ref', 'reactive', 'computed', 'watch', 'onMounted', 'onBeforeUnmount', 'defineProps', 'defineEmits', 'defineExpose'],
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    // 打包的时候压缩图片
    viteImagemin({
      gifsicle: {
        // gif图片压缩
        optimizationLevel: 3, // 选择1到3之间的优化级别
        interlaced: false, // 隔行扫描gif进行渐进式渲染
        // colors: 2 // 将每个输出GIF中不同颜色的数量减少到num或更少。数字必须介于2和256之间。
      },
      optipng: {
        // png
        optimizationLevel: 7, // 选择0到7之间的优化级别
      },
      mozjpeg: {
        // jpeg
        quality: 20, // 压缩质量，范围从0(最差)到100(最佳)。
      },
      pngquant: {
        // png
        quality: [0.8, 0.9], // Min和max是介于0(最差)到1(最佳)之间的数字，类似于JPEG。达到或超过最高质量所需的最少量的颜色。如果转换导致质量低于最低质量，图像将不会被保存。
        speed: 4, // 压缩速度，1(强力)到11(最快)
      },
      svgo: {
        // svg压缩
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: env.VITE_MODE === 'production' ? './' : '/',
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
})

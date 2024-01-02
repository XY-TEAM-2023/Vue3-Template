import { createApp } from 'vue'
import ContextMenu from './v-menu.vue'
import { config } from '@/config' // 确保路径正确
import * as ElIconModules from '@element-plus/icons-vue'
export default {
  mounted(el, binding) {
    el.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      const menuElement = document.createElement('div')
      document.body.appendChild(menuElement)
      document.body.classList.add('no-scroll')

      const app = createApp(ContextMenu, {
        items: binding.value,
        position: { x: event.clientX, y: event.clientY },
      })

      // 如果是管理后台, 全局引用
      if (config.websiteModel === 'admin') {
        // 注册所有 Element Plus 图标
        for (const iconName in ElIconModules) {
          config.elementPlusIconNames.push(iconName)
          app.component(iconName, ElIconModules[iconName])
        }
      }

      const vm = app.mount(menuElement)

      const close = (menuElement) => {
        return () => {
          vm.$el.remove()
          app.unmount()
          document.body.classList.remove('no-scroll')
          document.removeEventListener('click', close)
          document.body.removeChild(menuElement)
        }
      }

      const closeContextMenu = (menuElement) => {
        return (e) => {
          e.preventDefault()
          close(menuElement)
        }
      }

      setTimeout(() => {
        document.addEventListener('click', close(menuElement), { once: true })
        document.addEventListener('contextmenu', closeContextMenu(menuElement), { once: true })
      }, 0)
    })
  },
}

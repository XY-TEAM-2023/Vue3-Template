import { config } from '@/config'
import { isMobile } from '@/utils'
const useMobileRouter = config.websiteModel === 'mobile' || (!config.noMobileModel && isMobile())
const platform = useMobileRouter ? 'mobile' : 'desktop'
const layoutFile = useMobileRouter ? 'mobile.vue' : config.websiteModel === 'admin' ? 'admin.vue' : 'website.vue'

/**
 * 固定路由，没有登录可以看到的页面
 */
export const constantRoutes = [
  {
    path: '/404',
    name: '404',
    component: `/src/ui/base/404.vue`,
    meta: {
      title: '404',
      icon: null,
      hidden: true,
      needLogin: false,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: `/src/ui/views/${platform}/Login/LoginView.vue`,
    meta: {
      title: 'Login',
      needLogin: false,
    },
  },
  {
    path: '/',
    name: '/',
    component: `/src/ui/layout/${layoutFile}`,
    meta: { title: 'home', needLogin: true },
    children: [],
  },
  {
    path: '/index.html',
    redirect: '/',
  },
]

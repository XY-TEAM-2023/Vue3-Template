import { House } from '@element-plus/icons-vue'
import { config } from '@/config'
import isMobile from '@/utils'

const useMobileRouter = config.websiteModel === 'mobile' || (!config.noMobileModel && isMobile())
export const platform = useMobileRouter ? 'mobile' : 'desktop'
let layoutFile = (() => {
  if (useMobileRouter) {
    return 'mobile.vue'
  }
  if (config.websiteModel === 'website') {
    return 'website.vue'
  }
  if (config.websiteModel === 'admin') {
    return 'admin.vue'
  }
  return 'website.vue'
})()

// console.error('useMobileRouter', useMobileRouter)
console.error('platform', layoutFile)
// console.error('layout file path', `/src/ui/${platform}/layout/${layoutFile}`)

/**
 * 固定路由，没有登录可以看到的页面
 */
export const constantRoutes = [
  {
    path: '/404',
    name: '404',
    component: () => import(/* @vite-ignore */ `/src/ui/base/404.vue`),
    meta: {
      title: '404',
      icon: null,
      hidden: true,
      needLogin: false,
      roles: [], // 需要有权限之一才可以访问
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* @vite-ignore */ `/src/ui/views/${platform}/LoginView.vue`),
    meta: { title: 'Login', needLogin: false },
  },
  {
    path: '/',
    name: '/',
    component: () => import(/* @vite-ignore */ `/src/ui/layout/${layoutFile}`),
    meta: { title: 'home', needLogin: true },
    children: [],
  },
]

/**
 * 异步路由，登录后根据角色权限动态添加路由
 */
export const asyncRoutes = [
  {
    path: 'test',
    name: 'test',
    component: () => import(/* @vite-ignore */ `/src/ui/views/${platform}/test.vue`),
    meta: {
      title: 'test',
      icon: House,
      // hidden: true,
      needLogin: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
    children: [
      {
        path: 'AboutView333',
        name: 'AboutVie333w',
        component: () => import(/* @vite-ignore */ `/src/ui/views/${platform}/AboutView.vue`),
        meta: {
          title: 'AboutView',
          icon: House,
          // hidden: true,
          needLogin: false,
          public: {
            desktop: true,
            mobile: true,
          },
        },
      },
    ],
  },
  {
    path: 'AboutView',
    name: 'AboutView',
    component: () => import(/* @vite-ignore */ `/src/ui/views/${platform}/AboutView.vue`),
    meta: {
      title: 'AboutView',
      icon: House,
      // hidden: true,
      needLogin: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
  },
  {
    path: 'noPermission',
    name: 'noPermission',
    component: () => import('/src/ui/base/NoPermission.vue'),
    meta: {
      title: 'Export Zip',
      icon: House,
      hidden: false,
      needLogin: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
  },
  {
    path: 'AboutView1',
    name: 'AboutView1',
    component: () => import(/* @vite-ignore */ `/src/ui/views/${platform}/AboutView.vue`),
    meta: {
      title: 'AboutView',
      icon: House,
      // hidden: true,
      needLogin: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
  },
  {
    path: 'noPermission2',
    name: 'noPermission2',
    component: () => import(/* @vite-ignore */ `/src/ui/base/NoPermission.vue`),
    meta: {
      title: 'Export Zip',
      icon: House,
      hidden: false,
      needLogin: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
  },
  {
    path: 'AboutView3',
    name: 'AboutView3',
    component: () => import(/* @vite-ignore */ `/src/ui/views/${platform}/AboutView.vue`),
    meta: {
      title: 'AboutView',
      icon: House,
      // hidden: true,
      needLogin: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
  },
  {
    path: 'noPermission3',
    name: 'noPermission3',
    component: () => import(/* @vite-ignore */ `/src/ui/base/NoPermission.vue`),
    meta: {
      title: 'Export Zip',
      icon: House,
      hidden: false,
      needLogin: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
  },
]

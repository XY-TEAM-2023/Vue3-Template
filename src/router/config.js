import { House } from '@element-plus/icons-vue'
import { config } from '@/config'
import isMobile from '@/utils'

const useMobileRouter = config.websiteModel === 'mobile' || (!config.noMobileModel && isMobile())
export const platform = useMobileRouter ? 'mobile' : 'desktop'
let layoutFile = (() => {
  if (useMobileRouter) {
    return 'index.vue'
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
// console.error('platform', platform)
// console.error('layout file path', `/src/ui/${platform}/layout/${layoutFile}`)

/**
 * 固定路由，没有登录可以看到的页面
 */
export const constantRoutes = [
  {
    path: '/404',
    name: '404',
    component: () => import(`/src/ui/${platform}/views/base/404.vue`),
    meta: {
      title: '404',
      icon: null,
      hidden: true,
      needLogin: false,
      roles: [], // 需要有权限之一才可以访问
    },
  },
  {
    path: '/',
    name: '/',
    component: () => import(`/src/ui/${platform}/layout/${layoutFile}`),
    meta: { title: 'home', icon: House, needLogin: false },
    children: [
      {
        path: 'refresh',
        name: 'refresh',
        component: () => import(`/src/ui/${platform}/views/base/refresh.vue`),
        meta: {
          title: 'refresh',
          hidden: true,
          needLogin: false,
        },
      },
      {
        path: 'test',
        name: 'test',
        component: () => import(`/src/ui/${platform}/views/test.vue`),
        meta: {
          title: 'test',
          icon: House,
          // hidden: true,
          needLogin: false,
          public: {
            desktop: false,
            mobile: true,
          },
        },
      },
      {
        path: 'AboutView',
        name: 'AboutView',
        component: () => import(`/src/ui/${platform}/views/AboutView.vue`),
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
        component: () => import(`/src/ui/${platform}/views/base/NoPermission.vue`),
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
        component: () => import(`/src/ui/${platform}/views/AboutView.vue`),
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
        component: () => import(`/src/ui/${platform}/views/base/NoPermission.vue`),
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
        component: () => import(`/src/ui/${platform}/views/AboutView.vue`),
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
        component: () => import(`/src/ui/${platform}/views/base/NoPermission.vue`),
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
    ],
  },
]

/**
 * 异步路由，登录后根据角色权限动态添加路由
 */
export const asyncRoutes = [
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip', needLogin: true, roles: [] },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' },
  //     },
  //   ],
  // },
  // 404 page must be placed at the end !!!
]

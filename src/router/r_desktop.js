import { House } from '@element-plus/icons-vue'
import { config } from '@/config'

/**
 * 固定路由，没有登录可以看到的页面
 */
export const desktopConstantRoutes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/ui/desktop/views/base/404.vue'),
    meta: {
      title: '404',
      icon: null,
      hidden: true,
      needLogin: false,
    },
  },
  {
    path: '/',
    name: 'demo',
    component: () => import(`@/ui/desktop/layout/${config.websiteModel}.vue`),
    meta: { title: 'Export Zip', icon: House, needLogin: false },
    children: [
      {
        path: 'test',
        name: 'test',
        component: () => import('@/ui/desktop/views/test.vue'),
        meta: {
          title: 'test',
          icon: House,
          // hidden: true,
          needLogin: false,
        },
      },
      {
        path: 'AboutView',
        name: 'AboutView',
        component: () => import('@/ui/desktop/views/AboutView.vue'),
        meta: {
          title: 'AboutView',
          icon: House,
          // hidden: true,
          needLogin: false,
        },
      },
      {
        path: 'noPermission',
        name: 'noPermission',
        component: () => import('@/ui/desktop/views/base/NoPermission.vue'),
        meta: {
          title: 'Export Zip',
          icon: House,
          hidden: false,
          needLogin: false,
        },
      },
    ],
  },
]

/**
 * 异步路由，登录后根据角色权限动态添加路由
 */
export const desktopAsyncRoutes = [
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
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } },
]

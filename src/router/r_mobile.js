import { House } from '@element-plus/icons-vue'
import { config } from '@/config'

/**
 * 固定路由，没有登录可以看到的页面
 */
export const mobileConstantRoutes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/ui/mobile/views/base/404.vue'),
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
    component: () => import('@/ui/mobile/layout/index.vue'),
    meta: { title: 'Export Zip', icon: House, needLogin: false },
    children: [
      {
        path: 'test',
        name: 'test',
        component: () => import('@/ui/mobile/views/test.vue'),
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
        component: () => import('@/ui/mobile/views/AboutView.vue'),
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
        component: () => import('@/ui/mobile/views/base/NoPermission.vue'),
        meta: {
          title: 'Export Zip',
          icon: House,
          hidden: false,
          needLogin: false,
        },
      },
    ],
  },
  {
    path: '/test1',
    name: 'test1',
    component: () => import('@/ui/mobile/views/test.vue'),
    meta: {
      title: 'test',
      icon: House,
      // hidden: true,
      needLogin: false,
    },
  },
  {
    path: '/test2',
    name: 'test2',
    component: () => import('@/ui/mobile/views/test.vue'),
    meta: {
      title: 'test',
      icon: House,
      // hidden: true,
      needLogin: false,
    },
  },
  {
    path: '/test3',
    name: 'test3',
    component: () => import('@/ui/mobile/views/test.vue'),
    meta: {
      title: 'test',
      icon: House,
      // hidden: true,
      needLogin: false,
    },
  },
  {
    path: '/test4',
    name: 'test4',
    component: () => import('@/ui/mobile/views/test.vue'),
    meta: {
      title: 'test',
      icon: House,
      // hidden: true,
      needLogin: false,
    },
  },
]

/**
 * 异步路由，登录后根据角色权限动态添加路由
 */
export const mobileAsyncRoutes = [
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

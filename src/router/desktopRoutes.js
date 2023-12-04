import { House } from '@element-plus/icons-vue'

/**
 * 固定路由，没有登录可以看到的页面
 */
export const desktopConstantRoutes = [
  {
    path: '/',
    name: 'demo',
    component: () => import('@/components/layout/Layout.vue'),
    // hidden: true,
    meta: { title: 'Export Zip', icon: House },
    children: [
      {
        path: 'download',
        name: 'test',
        component: () => import('@/views/test.vue'),
        meta: { title: 'Export Zip', icon: House },
        // hidden: true,
      },
    ],
  },
  {
    path: '/noPermission',
    name: 'noPermission',
    component: () => import('@/views/base/NoPermission.vue'),
    // hidden: false,
    meta: { title: 'Export Zip', icon: House },
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
  { path: '/:pathMatch(.*)*', redirect: '/404', hidden: true },
]

/**
 * 固定路由，没有登录可以看到的页面
 */
export const mobileConstantRoutes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/test.vue'),
    hidden: true,
  },
  {
    path: '/noPermission',
    name: 'noPermission',
    component: () => import('@/views/base/NoPermission.vue'),
    hidden: true,
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
  { path: '/:pathMatch(.*)*', redirect: '/404', hidden: true },
]

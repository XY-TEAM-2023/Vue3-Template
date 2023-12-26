import { config } from '@/config'
import { isMobile } from '@/utils'

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
    component: `/src/ui/base/404.vue`,
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
    component: `/src/ui/views/${platform}/LoginView.vue`,
    meta: { title: 'Login', needLogin: false },
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

/**
 * 异步路由，登录后根据角色权限动态添加路由
 */
export const asyncRoutes = [
  {
    path: 'statistics',
    name: 'statistics',
    meta: {
      title: '统计管理',
      icon: 'Histogram',
      // hidden: true,
      needLogin: true,
      public: {
        desktop: true,
        mobile: true,
      },
    },
    children: [
      {
        path: 'ggrstatistics',
        name: 'ggrstatistics',
        component: `/src/ui/views/${platform}/Statistics/GGRStatisticsView.vue`,
        meta: {
          title: 'ggr统计',
          icon: 'House',
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
    path: 'FiManage',
    name: 'FiManage',
    meta: {
      title: '财务管理',
      icon: 'WalletFilled',
      // hidden: true,
      needLogin: true,
      public: {
        desktop: true,
        mobile: true,
      },
    },
    children: [
      {
        path: 'withdrawal',
        name: 'withdrawal',
        component: `/src/ui/views/${platform}/FiManage/WithdrawalView.vue`,
        meta: {
          title: '提款订单',
          icon: 'Back',
          // hidden: true,
          needLogin: false,
          public: {
            desktop: true,
            mobile: true,
          },
        },
      },
      {
        path: 'recharge',
        name: 'recharge',
        component: `/src/ui/views/${platform}/FiManage/RechargeView.vue`,
        meta: {
          title: '充值订单',
          icon: 'Right',
          // hidden: true,
          needLogin: false,
          public: {
            desktop: true,
            mobile: true,
          },
        },
      },
      {
        path: 'autoconfim',
        name: 'autoconfim',
        component: `/src/ui/views/${platform}/FiManage/AutoConfimView.vue`,
        meta: {
          title: '自动短信列表',
          icon: 'Finished',
          // hidden: true,
          needLogin: false,
          public: {
            desktop: true,
            mobile: true,
          },
        },
      },
      {
        path: 'FiRecords',
        name: 'FiRecords',
        component: `/src/ui/views/${platform}/FiManage/FiRecordsView.vue`,
        meta: {
          title: '充值提款记录',
          icon: 'Memo',
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
    path: 'member',
    name: 'member',
    meta: {
      title: 'memberListView.router',
      icon: 'Avatar',
      // hidden: true,
      needLogin: true,
      public: {
        desktop: true,
        mobile: true,
      },
    },
    children: [
      {
        path: 'memberlist',
        name: 'memberlist',
        component: `/src/ui/views/${platform}/Member/MemberListView.vue`,
        meta: {
          title: '会员列表',
          icon: 'House',
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
    path: 'agent',
    name: 'agent',
    meta: {
      title: '代理商管理',
      icon: 'Shop',
      // hidden: true,
      needLogin: true,
      public: {
        desktop: true,
        mobile: true,
      },
    },
    children: [
      {
        path: 'agentlist',
        name: 'agentlist',
        component: `/src/ui/views/${platform}/Agent/AgentListView.vue`,
        meta: {
          title: '代理商列表',
          icon: 'House',
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
    path: 'event',
    name: 'event',
    meta: {
      title: '活动管理',
      icon: 'Promotion',
      // hidden: true,
      needLogin: true,
      public: {
        desktop: true,
        mobile: true,
      },
    },
    children: [
      {
        path: 'eventmanage',
        name: 'eventmanage',
        component: `/src/ui/views/${platform}/Event/EventView.vue`,
        meta: {
          title: '活动设置',
          icon: 'House',
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
    path: 'gamelog',
    name: 'gamelog',
    meta: {
      title: '游戏记录',
      icon: 'List',
      // hidden: true,
      needLogin: true,
      public: {
        desktop: true,
        mobile: true,
      },
    },
    children: [
      {
        path: 'livegamelog',
        name: 'livegamelog',
        meta: {
          title: '真人娱乐场',
          icon: 'House',
          // hidden: true,
          needLogin: false,
          public: {
            desktop: true,
            mobile: true,
          },
        },
        children: [
          {
            path: 'evogamelog',
            name: 'evogamelog',
            component: `/src/ui/views/${platform}/GameLog/EvologView.vue`,
            meta: {
              title: 'EVO游戏记录',
              icon: 'House',
              // hidden: true,
              needLogin: false,
              public: {
                desktop: true,
                mobile: true,
              },
            },
          },
          {
            path: 'pp-slotlog',
            name: 'pp-slotlog',
            component: `/src/ui/views/${platform}/GameLog/PP-slotView.vue`,
            meta: {
              title: 'PP-slot记录',
              icon: 'House',
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
    ],
  },

  {
    path: 'test',
    name: 'test',
    component: `/src/ui/views/${platform}/test.vue`,
    meta: {
      title: 'test',
      icon: 'House',
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
        component: `/src/ui/views/${platform}/AboutView.vue`,
        meta: {
          title: 'AboutView',
          icon: 'House',
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
    component: `/src/ui/views/${platform}/AboutView.vue`,
    meta: {
      title: 'AboutView',
      icon: 'House',
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
      icon: 'House',
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
    component: `/src/ui/views/${platform}/AboutView.vue`,
    meta: {
      title: 'AboutView',
      icon: 'House',
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
    component: `/src/ui/base/NoPermission.vue`,
    meta: {
      title: 'Export Zip',
      icon: 'House',
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
    component: `/src/ui/views/${platform}/AboutView.vue`,
    meta: {
      title: 'AboutView',
      icon: 'House',
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
    component: `/src/ui/base/NoPermission.vue`,
    meta: {
      title: 'Export Zip',
      icon: 'House',
      hidden: false,
      needLogin: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
  },
  {
    path: 'members',
    name: 'members',
    component: `/src/ui/views/${platform}/User/UserListView.vue`,
    meta: {
      title: '用户列表',
      icon: 'House',
      hidden: false,
      needLogin: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
  },
  {
    path: 'roles',
    name: 'roles',
    component: `/src/ui/views/${platform}/Role/RoleListView.vue`,
    meta: {
      title: '角色列表',
      icon: 'M697.6 640H531.2v-32H768c32-12.8 64-19.2 102.4-19.2s76.8 6.4 108.8 19.2V204.8c0-12.8-6.4-25.6-12.8-38.4-12.8-12.8-25.6-12.8-38.4-12.8H64c-12.8 0-25.6 6.4-38.4 12.8-6.4 12.8-12.8 25.6-12.8 38.4v595.2c0 12.8 6.4 25.6 12.8 38.4s25.6 12.8 38.4 12.8h486.4c19.2-83.2 76.8-160 147.2-211.2z m-448-358.4c51.2 0 83.2 38.4 83.2 89.6s-32 83.2-83.2 83.2-83.2-38.4-83.2-83.2c0-51.2 38.4-89.6 83.2-89.6z m-192 409.6c6.4-89.6 89.6-160 192-160s185.6 70.4 192 160h-384z m384-384h467.2v32H441.6v-32zM512 467.2h396.8v32H512v-32z" fill="#040000" p-id="13672"></path><path d="M998.4 889.6c-12.8-6.4-19.2-12.8-25.6-19.2-6.4-6.4-6.4-12.8-6.4-25.6 0-6.4 0-19.2 6.4-25.6 6.4-6.4 12.8-12.8 19.2-12.8 0 0 6.4 0 6.4-6.4v-12.8c0-6.4 0-12.8-6.4-25.6 0-6.4-6.4-12.8-12.8-19.2l-6.4-6.4h-6.4c-6.4 6.4-19.2 6.4-25.6 6.4-6.4 0-19.2-6.4-25.6-12.8-6.4-6.4-12.8-12.8-12.8-25.6 0-6.4 0-19.2 6.4-25.6v-12.8c0-6.4-6.4-6.4-6.4-12.8-6.4 0-6.4-6.4-12.8-6.4s-6.4-6.4-12.8-6.4h-12.8s-6.4 0-6.4 6.4l-6.4 6.4c0 6.4-6.4 12.8-12.8 19.2s-12.8 6.4-25.6 6.4c-6.4 0-19.2 0-25.6-6.4 0 19.2-6.4 12.8-6.4 0 0 0 0-6.4-6.4-6.4l-6.4-6.4h-12.8c-6.4 0-6.4 0-12.8 6.4-6.4 0-6.4 6.4-12.8 6.4s-6.4 6.4-6.4 12.8v44.8c0 6.4-6.4 6.4-6.4 12.8-6.4 6.4-12.8 12.8-25.6 12.8h-38.4l-6.4 6.4c0 6.4-6.4 6.4-6.4 12.8s0 6.4-6.4 12.8V806.4l6.4 6.4c6.4 6.4 12.8 6.4 19.2 12.8 6.4 6.4 12.8 12.8 12.8 25.6 0 6.4 0 19.2-12.8 25.6-12.8 6.4-12.8 12.8-19.2 12.8s-6.4 6.4-6.4 12.8v12.8c0 6.4 0 12.8 6.4 12.8 0 6.4 6.4 6.4 6.4 12.8s6.4 6.4 6.4 6.4h12.8c6.4 0 12.8 0 19.2-6.4h12.8c6.4 0 12.8 6.4 12.8 6.4 6.4 6.4 6.4 12.8 12.8 19.2 0 6.4 0 12.8-6.4 19.2V1004.8l6.4 6.4c6.4 0 6.4 6.4 12.8 6.4s6.4 6.4 12.8 6.4H768l6.4-6.4c0-6.4 6.4-12.8 12.8-19.2s12.8-6.4 25.6-6.4c6.4 0 19.2 0 25.6 6.4s12.8 12.8 12.8 19.2c0 0 0 6.4 6.4 6.4H876.8c6.4 0 6.4 0 12.8-6.4 6.4 0 6.4-6.4 12.8-6.4s6.4-6.4 6.4-6.4c6.4-6.4 6.4-12.8 0-19.2v-6.4c0-6.4 6.4-19.2 12.8-25.6 0-6.4 6.4-6.4 12.8-6.4h51.2l6.4-6.4c0-6.4 6.4-6.4 6.4-12.8s6.4-6.4 6.4-12.8v-12.8c6.4-6.4-6.4-6.4-6.4-12.8z m-102.4-6.4c-6.4 12.8-12.8 19.2-19.2 25.6-6.4 6.4-19.2 12.8-25.6 19.2-12.8 6.4-19.2 6.4-32 6.4s-25.6 0-32-6.4c-12.8-6.4-19.2-12.8-25.6-19.2-6.4-6.4-12.8-19.2-19.2-25.6-6.4-12.8-6.4-19.2-6.4-32s0-25.6 6.4-32c6.4-12.8 12.8-19.2 19.2-25.6 6.4-6.4 19.2-12.8 25.6-19.2 12.8-6.4 19.2-6.4 32-6.4s25.6 0 32 6.4c12.8 6.4 19.2 12.8 25.6 19.2s12.8 19.2 19.2 25.6c6.4 12.8 6.4 19.2 6.4 32s0 25.6-6.4 32z',
      hidden: false,
      needLogin: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
  },
  {
    path: 'routers',
    name: 'routers',
    component: `/src/ui/views/${platform}/Router/RouterListView.vue`,
    meta: {
      title: '路由列表',
      icon: 'House',
      hidden: false,
      needLogin: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
  },
]

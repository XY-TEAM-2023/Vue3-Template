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
// console.error('platform', layoutFile)
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
      title: 'RouterMenu.statistics',
      icon: 'Histogram',
      // hidden: true,
      needLogin: true,
      cache: false,
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
          title: 'RouterMenu.ggrstatistics',
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
      title: 'RouterMenu.FiManage',
      icon: 'WalletFilled',
      // hidden: true,
      needLogin: true,
      cache: false,
      public: {
        desktop: true,
        mobile: true,
      },
    },
    children: [
      {
        path: 'recharge',
        name: 'recharge',
        component: `/src/ui/views/${platform}/FiManage/RechargeView.vue`,
        meta: {
          title: 'FIListView.DepositRequest',
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
        path: 'withdrawal',
        name: 'withdrawal',
        component: `/src/ui/views/${platform}/FiManage/WithdrawalView.vue`,
        meta: {
          title: 'FIListView.WithdrawalRequest',
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
        path: 'FiRecords',
        name: 'FiRecords',
        component: `/src/ui/views/${platform}/FiManage/FiRecordsView.vue`,
        meta: {
          title: 'FIListView.TransactionHistory',
          icon: 'Memo',
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
          title: 'FIListView.ShooterSms',
          icon: 'Finished',
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
      title: 'MemberView.menu',
      icon: 'Avatar',
      // hidden: true,
      needLogin: true,
      cache: false,
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
          title: 'MemberView.title',
          icon: 'List',
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
      title: 'RouterMenu.agent',
      icon: 'Shop',
      // hidden: true,
      needLogin: true,
      cache: false,
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
          title: 'RouterMenu.agentlist',
          icon: 'List',
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
      title: 'RouterMenu.event',
      icon: 'Promotion',
      // hidden: true,
      needLogin: true,
      cache: false,
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
          icon: 'Grid',
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
      title: 'RouterMenu.gamelog',
      icon: 'Stamp',
      // hidden: true,
      needLogin: true,
      cache: false,
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
          title: 'RouterMenu.livegamelog',
          icon: 'MessageBox',
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
              title: 'RouterMenu.evogamelog',
              icon: 'MoreFilled',
              // hidden: true,
              needLogin: false,
              public: {
                desktop: true,
                mobile: true,
              },
            },
          },
          {
            path: 'ppslotlog',
            name: 'ppslotlog',
            component: `/src/ui/views/${platform}/GameLog/PP-slotView.vue`,
            meta: {
              title: 'RouterMenu.ppslotlog',
              icon: 'MoreFilled',
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
    path: 'members',
    name: 'members',
    component: `/src/ui/views/${platform}/User/UserListView.vue`,
    meta: {
      title: 'userListView.router',
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
      title: 'roleListView.router',
      icon: 'Home',
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
      title: 'routerListView.router',
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

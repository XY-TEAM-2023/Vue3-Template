import { Histogram, House, List } from '@element-plus/icons-vue'

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
        path: 'autoconfim',
        name: 'autoconfim',
        meta: {
          title: '自动对账列表',
          icon: 'M834.1 469.2c-19.5-43.8-47.4-82.6-82.9-115.2l-29.1-26.7c-4.3-3.8-11.1-2.1-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1 0.1-2.8-0.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5-14.2 17.2-30.1 32.7-47.5 46.1-42.1 32.3-76.8 74.4-100.3 121.5C172.5 503.3 160 556.6 160 610c0 47.2 9.3 92.9 27.7 136 17.8 41.5 43.2 78.9 75.5 110.9 32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3c41.9-17.5 79.6-42.6 111.9-74.7 32.4-32 57.8-69.4 75.5-110.9 18.4-43.1 27.7-88.8 27.7-136 0-48.8-10-96.2-29.9-140.9z',
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
        meta: {
          title: '新充值订单',
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
        path: 'withdrawal',
        name: 'withdrawal',
        meta: {
          title: '新提款订单',
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
        path: 'FiRecords',
        name: 'FiRecords',
        meta: {
          title: '充值提款记录',
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
    path: 'member',
    name: 'member',
    meta: {
      title: '用户管理',
      icon: 'House',
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
      icon: 'House',
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
      icon: 'House',
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
      icon: 'House',
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
    meta: {
      title: '角色列表',
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
    path: 'routers',
    name: 'routers',
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

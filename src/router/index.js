import { createRouter, createWebHistory } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import { useUserStore } from '@/stores/user'
import { config } from '@/config'
import NProgress from 'nprogress'
import { useAppStore } from '@/stores/app'
import { constantRoutes, asyncRoutes, platform } from './config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
})

router.config = []

/**
 * 检查路由是否已开放
 * @param r
 * @returns {boolean}
 */
function checkRouterIsPublic(r) {
  if (r.meta === undefined) {
    return true
  }
  if (r.meta.public === undefined) {
    return true
  }
  const p = r.meta.public

  if (platform === 'desktop') {
    if (p.desktop === undefined) {
      return true
    }
    return p.desktop
  } else if (platform === 'mobile') {
    if (p.mobile === undefined) {
      return true
    }
    return p.mobile
  }
  return false
}

/**
 * 检查路由是否权限
 * @param route 路由
 * @param curRoles 当前拥有的角色列表
 */
function checkRouterHasRole(route, curRoles) {
  if (route.meta.roles === undefined) {
    return true
  }
  if (route.meta.roles.length === 0) {
    return true
  }
  if (curRoles === undefined || curRoles.length === 0) {
    return false
  }

  return route.some((role) => curRoles.includes(role))
}

let consoleIndex = 0

/**
 * 加载Route的配置
 */
function loadRouteConfig(routerConfig, curRoles) {
  if (!routerConfig) return

  routerConfig.forEach((route) => {
    if (tryLoadRouteGroup(route, curRoles, '')) {
      router.config.push(route)
      router.addRoute(route)
    }
  })

  // 检查是否有重复name的路由
  const sames = []
  router.config.forEach((route) => {
    checkRouteSameName(route, sames, [])
  })

  if (Object.keys(sames).length > 0) {
    console.error('路由配置name重复. ' + sames.join(', '))
    ElMessageBox.alert(sames.join(', '), '路由配置name重复', {
      showClose: false,
      confirmButtonText: 'OK',
      callback: () => {},
    })
  }
}

function checkRouteSameName(route, sames, names) {
  if (names.includes(route.name)) {
    if (!sames.includes(route.name)) {
      sames.push(route.name)
    }
  } else {
    names.push(route.name)
  }

  if (route.children) {
    route.children.forEach((route) => {
      checkRouteSameName(route, sames, names)
    })
  }
}

/**
 * 加载路由组
 * @param route 路由
 * @param curRoles 当前拥有的角色列表
 * @param parentPath 上级路由路径
 */
function tryLoadRouteGroup(route, curRoles, parentPath = '') {
  if (parentPath) {
    if (parentPath === '/') {
      route.fullPath = parentPath + route.path
    } else {
      route.fullPath = parentPath + '/' + route.path
    }
  } else {
    route.fullPath = route.path
  }

  if (!checkRouterIsPublic(route)) {
    return false
  }
  if (!checkRouterHasRole(route, curRoles)) {
    return false
  }
  let canLoad = false
  if (route.children === undefined) {
    canLoad = true
  } else {
    // 检查子路由
    let index = -1
    while (index + 1 < route.children.length) {
      const child = route.children[++index]
      if (!tryLoadRouteGroup(child, curRoles, route.fullPath)) {
        route.children.splice(index--, 1)
        continue
      }
      canLoad = true
    }
  }
  if (canLoad) {
    console.log(`${++consoleIndex}. ${route.fullPath}`)
  }

  return canLoad
}

/**
 * 根据手机还是PC, 重新加载路由
 */
router.reloadRoutes = function (curRoles) {
  // 清空路由
  router.getRoutes().forEach((route) => {
    const name = route.name
    if (name) {
      router.removeRoute(name)
    }
  })
  router.config = []

  console.log('重新加载Router配置')

  consoleIndex = 0

  const layoutIndex = constantRoutes.findIndex((route) => route.name === '/')
  constantRoutes[layoutIndex].children = asyncRoutes
  const refreshRouteIndex = constantRoutes[layoutIndex].children.findIndex((route) => route.name === 'refresh')
  if (refreshRouteIndex === -1) {
    constantRoutes[layoutIndex].children.push({
      path: 'refresh',
      name: 'refresh',
      component: () => import(`/src/ui/${platform}/views/base/refresh.vue`),
      meta: {
        title: 'refresh',
        hidden: true,
        needLogin: false,
      },
    })
  }

  console.warn(constantRoutes)

  // 加载路径
  loadRouteConfig(constantRoutes, curRoles)

  // 添加不存在的页面重定向
  router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } })
}

router.beforeEach(
  /**
   * 前置路由
   * @param to 即将要进入的目标路由对象
   * @param from 当前导航正要离开的路由
   * @param next next() 继续执行；next(false) 中断导航；next('/') 或 next({ path: '/' }): 跳转到一个不同的地址
   */
  (to, from, next) => {
    NProgress.start()

    // console.log(`!!!!!!!!!!!!!!!!!!!!路由守卫, from: ${from.fullPath}, to: ${to.fullPath}`)
    const userStore = useUserStore()
    // 登录状态 -1未登录；0已登录；1登录失效；
    const loginStatus = userStore.loginStatus

    if (to.path === '/') {
      // 如果访问的是根目录
      if (loginStatus === -1) {
        // 跳转到登录页面
        if (config.router.loginPage && config.router.loginPage !== to.path) {
          next(config.router.loginPage)
        } else {
          next()
        }
      } else {
        // 跳转到登录成功后的第一个页面
        if (config.router.loginSuccessPage && config.router.loginSuccessPage !== to.path) {
          next(config.router.loginSuccessPage)
        } else {
          next()
        }
      }
    } else if (!to.meta || !to.meta.needLogin) {
      // 不需要登录, 直接访问页面
      next()
    } else if (loginStatus === -1) {
      // 未登录
      ElMessageBox.alert(i18n.global.t('app.needLogin'), '', {
        showClose: false,
        confirmButtonText: i18n.global.t('com.btnOk'),
        callback: () => {
          // 如果有登录页面, 访问登录页面
          if (config.router.loginPage) {
            next(config.router.loginPage)
          }
        },
      })
    } else if (loginStatus === 1) {
      // 登录失效
      ElMessageBox.alert(i18n.global.t('app.sessionTimeout'), '', {
        showClose: false,
        confirmButtonText: i18n.global.t('com.btnOk'),
        callback: () => {
          // 如果有登录页面, 访问登录页面
          if (config.router.loginPage) {
            next(config.router.loginPage)
          }
        },
      })
    } else {
      // 已登录, 判断角色权限
      if (to.roles && to.roles.length > 0) {
        // 需要角色权限
        if (to.roles.some((item) => userStore.roles.includes(item))) {
          // 可以访问
          next()
        } else {
          // 无权限访问
          next('/noPermission')
        }
      }
    }
  }
)

router.afterEach(() => {
  const appStore = useAppStore()
  appStore.routerPath = router.currentRoute.value.fullPath
  NProgress.done()
})

export default router

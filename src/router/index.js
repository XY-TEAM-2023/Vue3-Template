import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import { useUserStore } from '@/stores/user'
import { config } from '@/config'
import NProgress from 'nprogress'
import { useAppStore } from '@/stores/app'
import { constantRoutes, asyncRoutes, platform } from './config'

let router = createRouter({
  history: config.localMode ? createWebHashHistory(import.meta.env.BASE_URL) : createWebHistory(import.meta.env.BASE_URL),
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
  if (route.meta === undefined) {
    return true
  }
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

const comps = import.meta.glob('/src/ui/**/*.vue')

/**
 * 加载Route的配置
 */
function loadRouteConfig(routerConfig) {
  if (!routerConfig) return

  routerConfig.forEach((route) => {
    if (tryLoadRouteGroup(route, '')) {
      router.config.push(route)
      router.addRoute(route)
      console.log(route)
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
 * @param parentPath 上级路由路径
 */
function tryLoadRouteGroup(route, parentPath = '') {
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

  let canLoad = false
  if (route.children === undefined) {
    canLoad = true
  } else {
    // 检查子路由
    let index = -1
    while (index + 1 < route.children.length) {
      const child = route.children[++index]
      if (!tryLoadRouteGroup(child, route.fullPath)) {
        route.children.splice(index--, 1)
        continue
      }
      canLoad = true
    }
  }
  if (canLoad) {
    if (typeof route.component === 'string') {
      // console.warn(route.component, ' || ', comps[route.component])
      route.component = comps[route.component]
    }
    // console.log(`${++consoleIndex}. ${route.fullPath}`)
  }

  return canLoad
}

/** 重新加载路由配置 */
const reloadRoutes_build = function () {
  const parse_router_config_cb = (routes, parentPath = '') => {
    routes.forEach((item) => {
      if (item.redirect) {
        return
      }

      if (parentPath === '') {
        if (!item.path.startsWith('/')) {
          item.path = '/' + item.path
        }
      }

      // 组织完整路径
      if (parentPath) {
        if (parentPath === '/') {
          item.fullPath = parentPath + item.path
        } else {
          item.fullPath = parentPath + '/' + item.path
        }
      } else {
        item.fullPath = item.path
      }

      if (item.children && item.children.length > 0) {
        reload_handler_cb(item.children, item.fullPath)
      }
    })
  }
  const reload_handler_cb = (routes, parentPath = '') => {
    routes.forEach((item) => {
      if (item.redirect) {
        router.config.push(item)
        return
      }

      item.path = item.name
      if (parentPath === '') {
        if (!item.path.startsWith('/')) {
          item.path = '/' + item.path
        }
      }

      // 组织完整路径
      if (parentPath) {
        if (parentPath === '/') {
          item.fullPath = parentPath + item.path
        } else {
          item.fullPath = parentPath + '/' + item.path
        }
      } else {
        item.fullPath = item.path
      }

      if (item.children && item.children.length > 0) {
        console.error(item.children)
        reload_handler_cb(item.children, item.fullPath)
      }

      // 第一次循环
      if (parentPath === '') {
        console.log(parentPath, '|', item)
        router.addRoute(item)
        router.config.push(item)
      }
    })
  }
  const get_route_component_cb = (routerInfo) => {
    if (!routerInfo.component) {
      return null
    }

    if (!routerInfo.enable_mobile && !routerInfo.enable_desktop) {
      return null
    }
    let arg = ''
    if (platform === 'desktop') {
      arg = routerInfo.enable_desktop ? 'desktop' : 'mobile'
    } else if (platform === 'mobile') {
      arg = routerInfo.enable_desktop ? 'mobile' : 'desktop'
    } else {
      return null
    }

    return comps[routerInfo.component.replace('{platform}', arg)]
  }

  let localStorageUserStr = localStorage.getItem('user')
  const localStorageUser = localStorageUserStr ? JSON.parse(localStorageUserStr) : { routes: [] }
  const async_routes = localStorageUser.routes
  // 清空路由
  router.getRoutes().forEach((route) => {
    const name = route.name
    if (name) {
      router.removeRoute(name)
    }
  })
  router.config = []

  // 整理动态路由数据
  let asyncRoutesData = []
  async_routes.forEach((item) => {
    if (item.display && item.component) {
      asyncRoutesData.push({
        name: item.name,
        path: item.name,
        icon: item.icon,
        component: get_route_component_cb(item),
        meta: {
          title_en: item.title_en,
          title_zh: item.title_zh,
          title_ko: item.title_ko,
          cache: item.cache,
        },
      })
    }
  })

  const newConfig = []
  constantRoutes.forEach((item) => {
    item.component = comps[item.component]
    if (item.name === '/') {
      item.children = asyncRoutesData
    }
    newConfig.push(item)
  })

  // 整理数据
  parse_router_config_cb(newConfig)
  // 不存在的页面匹配404
  // newConfig.push({ path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } })

  // 加载路由配置
  newConfig.forEach((item) => {
    console.log(item)
    router.addRoute(item)
    router.config.push(item)
  })
}

/**
 * 根据手机还是PC, 重新加载路由
 */
const reloadRoutes_dev = function () {
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

  // 动态路由
  const layoutIndex = constantRoutes.findIndex((route) => route.name === '/')
  constantRoutes[layoutIndex].children = asyncRoutes
  const refreshRouteIndex = constantRoutes[layoutIndex].children.findIndex((route) => route.name === 'refresh')
  if (refreshRouteIndex === -1) {
    constantRoutes[layoutIndex].children.push({
      path: 'refresh',
      name: 'refresh',
      component: () => import(/* @vite-ignore */ `/src/ui/base/refresh.vue`),
      meta: {
        title: 'refresh',
        hidden: true,
        needLogin: false,
      },
    })
  }

  // 加载路径
  loadRouteConfig(constantRoutes)
  // 添加不存在的页面重定向
  // router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } })

  // console.log(router.config)
  // console.log(router.options.routes)
}

router.reloadRoutes = function () {
  let isBuild = true
  if (import.meta.env.DEV) {
    isBuild = config.buildMode
  } else {
    isBuild = false
  }

  if (isBuild) {
    reloadRoutes_build()
  } else {
    reloadRoutes_dev()
  }
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

    console.error('to.path', to.path)
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
        if (config.router.homePage && config.router.homePage !== to.path) {
          next(config.router.homePage)
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
      } else {
        next()
      }
    }
  }
)

router.afterEach(() => {
  const appStore = useAppStore()
  const new_full_path = router.currentRoute.value.fullPath
  // 设置当前的页面
  appStore.routerPath = new_full_path

  // 如果跳转的是登录页面, 清空用户信息
  if (new_full_path === config.router.loginPage) {
    useUserStore().logout()
  }

  // 添加已打开的页面Tab
  if (
    new_full_path !== config.router.homePage &&
    !new_full_path.startsWith('/refresh') &&
    !constantRoutes.some((item) => {
      return item.fullPath === new_full_path
    })
  ) {
    if (!appStore.openedTabs.some((item) => item.fullPath === new_full_path)) {
      const r = router.currentRoute.value

      let isBuild = true
      if (import.meta.env.DEV) {
        isBuild = config.buildMode
      } else {
        isBuild = false
      }

      if (isBuild) {
        appStore.openedTabs.push({
          name: r.name,
          title_zh: r.meta.title_zh,
          title_en: r.meta.title_en,
          title_ko: r.meta.title_ko,
          fullPath: r.fullPath,
        })
      } else {
        appStore.openedTabs.push({
          name: r.meta.title,
          fullPath: r.fullPath,
        })
      }
    }
  }

  NProgress.done()
})

// 刷新当前页面
router.refreshCurPage = () => {
  // console.error(router.currentRoute.value)
  const curPath = router.currentRoute.value.fullPath
  router.push({ path: '/refresh', query: { redirect: curPath } })
  useAppStore().tryHideRouteRedDot(curPath)
}

export default router

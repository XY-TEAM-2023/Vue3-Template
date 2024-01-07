import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import { useUserStore } from '@/stores/user'
import { config } from '@/config'
import NProgress from 'nprogress'
import { useAppStore } from '@/stores/app'
import { asyncRoutes, constantRoutes, platform } from './config'
import { cloneDeep } from 'lodash-es'

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

let consoleIndex = 0
const comps = import.meta.glob('/src/ui/**/*.vue')

/**
 * 加载Route的配置
 */
function loadRouteConfig(routerConfig) {
  if (!routerConfig) return

  routerConfig.forEach((route) => {
    if (tryLoadRouteGroup(route, '')) {
      console.log(route)
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
      const tempComponent = route.component.replace('${platform}', platform)
      console.warn(tempComponent, ' || ', comps[tempComponent])
      route.component = comps[tempComponent]
      route.meta.component = getComponentNameFromPath(tempComponent)
    }
    // console.log(`${++consoleIndex}. ${route.fullPath}`)
  }

  return canLoad
}

/**
 * 根据手机还是PC, 重新加载路由
 */
const reloadRoutesHandler = function (asyncRoutesConfig) {
  // console.error('asyncRoutesConfig', asyncRoutesConfig)
  // 清空路由
  router.getRoutes().forEach((route) => {
    const name = route.name
    if (name) {
      router.removeRoute(name)
    }
  })
  router.config = []

  // console.log('重新加载Router配置')

  consoleIndex = 0

  // 动态路由
  const layoutIndex = constantRoutes.findIndex((route) => route.name === '/')
  constantRoutes[layoutIndex].children = asyncRoutesConfig
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
  router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } })
}

const isBuildMode = import.meta.env.DEV ? config.buildMode : false

router.reloadRoutes = function (isUseStore = false) {
  if (isBuildMode) {
    // reloadRoutes_build(isUseStore)
    if (isUseStore) {
      reloadRoutesHandler(cloneDeep(useUserStore().routes))
    } else {
      let localStorageUserStr = localStorage.getItem('user')
      const localStorageUser = localStorageUserStr ? JSON.parse(localStorageUserStr) : { routes: [] }
      const tempAsyncRouters = localStorageUser.routes ? localStorageUser.routes : []
      reloadRoutesHandler(tempAsyncRouters)
    }
  } else {
    reloadRoutesHandler(asyncRoutes)
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

    // console.error('to.path', to.path)
    if (to.path === '/') {
      // 如果访问的是根目录
      if (loginStatus === -1) {
        // 跳转到登录页面
        if (config.router.loginPage && config.router.loginPage !== to.path) {
          if (config.router.loginPage.startsWith('/')) {
            next({ path: config.router.loginPage })
          } else {
            next({ name: config.router.loginPage })
          }
        } else {
          next()
        }
      } else {
        const homePage = isBuildMode ? userStore.homePage : config.router.homePage
        // console.error('?????????????', homePage)
        // 跳转到登录成功后的第一个页面
        if (homePage && homePage !== to.path) {
          if (homePage.startsWith('/')) {
            next({ path: homePage })
          } else {
            next({ name: homePage })
          }
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

const getComponentNameFromPath = (filePath) => {
  const pathParts = filePath.split('/') // 分割路径
  const fileNameWithExtension = pathParts[pathParts.length - 1] // 获取文件名
  const fileName = fileNameWithExtension.split('.')[0] // 移除扩展名

  // 检查是否为 'index'
  if (fileName === 'index') {
    // 如果是 'index'，返回上一级目录的名字
    return pathParts[pathParts.length - 2]
  }

  return fileName
}

router.afterEach(() => {
  const appStore = useAppStore()
  const new_full_path = router.currentRoute.value.fullPath
  const curRouteName = router.currentRoute.value.name
  // 设置当前的页面
  appStore.routerPath = new_full_path
  appStore.routerName = curRouteName

  // 如果跳转的是登录页面, 清空用户信息
  if (new_full_path === config.router.loginPage) {
    useUserStore().logout()
  }

  // 尝试添加页面缓存
  console.log(router.currentRoute.value)
  if (router.currentRoute.value.meta.cache) {
    const fileName = router.currentRoute.value.meta.component
    if (!appStore.keepAliveMenus.includes(fileName)) {
      appStore.keepAliveMenus.push(fileName)
    }
  }
  console.log(appStore.keepAliveMenus)

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
          title: r.meta.title,
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

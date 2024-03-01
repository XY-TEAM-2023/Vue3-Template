import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import { useUserStore } from '@/stores/user'
import { config } from '@/config'
import NProgress from 'nprogress'
import { useAppStore } from '@/stores/app'
import { platform } from './asyncRoutes'
import { constantRoutes } from './constantRoutes'
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

const comps = import.meta.glob('/src/ui/**/*.*')

/**
 * 加载Route的配置
 */
function loadRouteConfig(routerConfig) {
  if (!routerConfig) return

  routerConfig.forEach((route) => {
    // console.log(route)
    if (tryLoadRouteGroup(route, '')) {
      // console.log(route)
      router.config.push(route)
      router.addRoute(route)
      // console.log('```````````````')
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
  if (!route.path) {
    route.path = route.name
  }

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
      if (!route.meta) {
        route.meta = {}
      }
      route.meta.componentPath = route.component.replace('${platform}', platform)
      route.component = comps[route.meta.componentPath]
    }
  }

  return canLoad
}

/**
 * 根据手机还是PC, 重新加载路由
 */
const reloadRoutesHandler = function (asyncRoutesConfig) {
  asyncRoutesConfig.forEach((item) => {
    if (!item.meta) {
      item.meta = {
        needLogin: true,
      }
    }
    if (item.meta.needLogin === undefined) {
      item.meta.needLogin = true
    }
  })

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
}

router.reloadRoutes = function (loadAsyncRouters = false) {
  if (loadAsyncRouters) {
    // console.log(useUserStore().routes)
    reloadRoutesHandler(cloneDeep(useUserStore().routes))
  } else {
    let localStorageUserStr = localStorage.getItem('user')
    const localStorageUser = localStorageUserStr ? JSON.parse(localStorageUserStr) : { routes: [] }
    const tempAsyncRouters = localStorageUser.routes ? localStorageUser.routes : []
    // console.log(tempAsyncRouters)
    reloadRoutesHandler(tempAsyncRouters)
  }
}

/** 检查路由是否存在 */
function checkRouterExists(routeName) {
  if (routeName === undefined) {
    return false
  }
  // 在你的组件或 JavaScript 代码中
  const routes = router.getRoutes()
  return routes.some((route) => route.name === routeName)
}

router.beforeEach(
  /**
   * 前置路由
   * @param to 即将要进入的目标路由对象
   * @param from 当前导航正要离开的路由
   * @param next next() 继续执行；next(false) 中断导航；next('/') 或 next({ path: '/' }): 跳转到一个不同的地址
   */
  (to, from, next) => {
    // 浏览器是否已经打开过了
    const isOpenedBrowser = sessionStorage.getItem('isOpenedBrowser') === 'true'
    if (isOpenedBrowser) {
      NProgress.start()
    }

    // console.error('from', from, 'to', to)

    // 检查路由是否存在 --------------------------------
    if (!checkRouterExists(to.name)) {
      next({ name: '404' })
      return
    }

    // console.log(`!!!!!!!!!!!!!!!!!!!!路由守卫, from: ${from.fullPath}, to: ${to.fullPath}`)
    const userStore = useUserStore()
    // 登录状态 -1未登录；0已登录；1登录失效；
    const loginStatus = userStore.getLoginStatus()
    // console.log('>>>>>>>>>>>>>>>', to)

    const nextCb = (page) => {
      if (!page) {
        next()
        appStore.routerPath = to.fullPath
        return
      }
      if ((page + '').startsWith('/')) {
        // console.log('>>>> next ', page)
        next({ path: page })
      } else {
        // console.log('>>>> next ', page)
        next({ name: page })
      }
    }

    if (to.path === '/') {
      // 如果访问的是根目录
      // console.log('如果访问的是根目录')
      if (loginStatus === -1) {
        if (config.router.loginPage && config.router.loginPage !== to.path) {
          // 跳转到登录页面
          nextCb(config.router.loginPage)
        } else {
          nextCb()
        }
      } else {
        const homePage = userStore.homePage
        // 跳转到登录成功后的第一个页面
        if (homePage && homePage !== to.path) {
          nextCb(homePage)
        } else {
          nextCb()
        }
      }
    } else if (!to.meta || !to.meta.needLogin) {
      // 不需要登录, 直接访问页面
      nextCb()
    } else if (loginStatus === -1) {
      // 未登录
      if (isOpenedBrowser) {
        ElMessageBox.alert(i18n.global.t('app.needLogin'), '', {
          showClose: false,
          confirmButtonText: i18n.global.t('com.btnOk'),
          callback: () => {
            useUserStore().logout()
          },
        })
      } else {
        useUserStore().logout()
      }
    } else if (loginStatus === 1) {
      // 登录失效
      if (isOpenedBrowser) {
        ElMessageBox.alert(i18n.global.t('app.sessionTimeout'), '', {
          showClose: false,
          confirmButtonText: i18n.global.t('com.btnOk'),
          callback: () => {
            useUserStore().logout()
          },
        })
      } else {
        useUserStore().logout()
      }
    } else {
      // 已登录, 判断角色权限
      if (to.roles && to.roles.length > 0) {
        // 需要角色权限
        if (to.roles.some((item) => userStore.roles.includes(item))) {
          // 可以访问
          nextCb()
        } else {
          // 无权限访问
          nextCb('/noPermission')
        }
      } else {
        nextCb()
      }
    }
  }
)

/** 尝试加载页面对应的国际化文本 */
const tryLoadI18n = (i18nJs) => {
  const i18nFileLoad = i18nJs
  if (!i18nFileLoad) {
    return // 没有找到翻译文件
  }

  i18nFileLoad()
    .then((messagesModule) => {
      const newTranslations = messagesModule.default

      // 遍历每种语言并合并翻译
      Object.keys(newTranslations).forEach((lang) => {
        // 获取现有的翻译（如果存在）
        const existingTranslations = i18n.global.messages[lang] || {}

        // 合并现有的翻译与新的翻译，并设置到 i18n 实例中
        i18n.global.setLocaleMessage(lang, { ...existingTranslations, ...newTranslations[lang] })
      })
    })
    .catch((error) => {})
}

Object.entries(comps).forEach(([key, value]) => {
  if (key.endsWith('i18n.js')) {
    tryLoadI18n(value)
  }
})

router.afterEach(() => {
  const isOpenedBrowser = sessionStorage.getItem('isOpenedBrowser') === 'true'

  sessionStorage.setItem('isOpenedBrowser', 'true')

  const appStore = useAppStore()
  const new_full_path = router.currentRoute.value.fullPath
  const curRouteName = router.currentRoute.value.name
  // 设置当前的页面
  appStore.routerPath = new_full_path
  appStore.routerName = curRouteName

  // console.error(router.currentRoute.value)
  // 如果跳转的是登录页面, 清空用户信息
  if (new_full_path === config.router.loginPage) {
    useUserStore().logout()
  }

  // 尝试添加页面缓存
  // console.log(router.currentRoute.value)
  // if (router.currentRoute.value.meta.cache) {
  //   const fileName = router.currentRoute.value.meta.componentName
  //   if (!appStore.keepAliveMenus.includes(fileName)) {
  //     appStore.keepAliveMenus.push(fileName)
  //   }
  // }
  // console.log(appStore.keepAliveMenus)

  // 添加已打开的页面Tab
  if (
    new_full_path !== config.router.homePage &&
    !new_full_path.startsWith('/refresh') &&
    !router.currentRoute.value.children &&
    !constantRoutes.some((item) => {
      return item.fullPath === new_full_path
    })
  ) {
    if (!appStore.openedTabs.some((item) => item.fullPath === new_full_path)) {
      const r = router.currentRoute.value

      if (r.name === undefined || r.name === '') {
        return
      }

      appStore.openedTabs.push({
        name: r.name,
        title: r.meta.title,
        fullPath: r.fullPath,
      })
    }
  }

  if (isOpenedBrowser) {
    console.log('NProgress.done()')
    NProgress.done()
  } else {
    document.getElementById('loading').style.display = 'none'
  }
})

// 刷新当前页面
router.refreshCurPage = () => {
  // console.error(router.currentRoute.value)
  const curPath = router.currentRoute.value.fullPath
  router.push({ path: '/refresh', query: { redirect: curPath } })
  useAppStore().tryHideRouteRedDot(curPath)
}

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import isMobile from '@/utils'
import { useUserStore } from '@/stores/user'
import { config } from '@/config'
import NProgress from 'nprogress'
import { useAppStore } from '@/stores/app'
import { desktopAsyncRoutes, desktopConstantRoutes } from './r_desktop'
import { mobileAsyncRoutes, mobileConstantRoutes } from './r_mobile'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
})

let constantRoutes = []
let asyncRoutes = []

router.config = []
/**
 * 根据手机还是PC, 重新加载路由
 */
router.reloadRoutes = function () {
  // 清空路由
  router.getRoutes().forEach((route) => {
    const name = route.name
    if (name) {
      router.removeRoute(name)
    }
  })
  router.config = []

  // 加载手机还是PC路由配置
  const useMobileRouter = config.websiteModel === 'mobile' || (!config.noMobileModel && isMobile())
  constantRoutes = useMobileRouter ? mobileConstantRoutes : desktopConstantRoutes
  asyncRoutes = useMobileRouter ? mobileAsyncRoutes : desktopAsyncRoutes

  console.log('useMobileRouter', useMobileRouter)
  // console.log(constantRoutes)
  // console.log(asyncRoutes)

  let index = 0
  console.log('重新加载Router配置')

  // 所有人都可以访问的页面
  if (constantRoutes) {
    constantRoutes.forEach((route) => {
      console.log(`${++index}. ${route.path}`)
      router.config.push(route)
      router.addRoute(route)
    })
  }

  // 根据用户权限动态加载的路由
  if (asyncRoutes) {
    // TODO: 服务器分配权限
    asyncRoutes.forEach((route) => {
      console.log(`${++index}. ${route.path}`)
      router.config.push(route)
      router.addRoute(route)
    })
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

    console.log('路由守卫：' + to.path)
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

router.reloadRoutes()

export default router

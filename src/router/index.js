import { createRouter, createWebHistory } from 'vue-router'
import { mobileAsyncRoutes, mobileConstantRoutes } from '@/router/mobileRoutes'
import { desktopAsyncRoutes, desktopConstantRoutes } from '@/router/desktopRoutes'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import isMobile from '@/utils'

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

  const is_mobile = isMobile()
  // 根据手机还是PC加载路由配置
  constantRoutes = is_mobile ? mobileConstantRoutes : desktopConstantRoutes
  asyncRoutes = is_mobile ? mobileAsyncRoutes : desktopAsyncRoutes
  console.log(constantRoutes)
  console.log(asyncRoutes)

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

/** 登录页面 */
let loginPath = ''

router.beforeEach(
  /**
   * 前置路由
   * @param to 即将要进入的目标路由对象
   * @param from 当前导航正要离开的路由
   * @param next next() 继续执行；next(false) 中断导航；next('/') 或 next({ path: '/' }): 跳转到一个不同的地址
   */
  (to, from, next) => {
    // const userStore = useUserStore()
    next()
    return
    if (to.path === '/noPermission') {
      return
    }
    ElMessageBox.alert(i18n.global.t('app.needLogin'), '', {
      showClose: false,
      confirmButtonText: i18n.global.t('com.btnOk'),
      callback: (action) => {
        console.log(action)
        next({ path: '/noPermission' })
      },
    })
    return
    // 登录状态 -1未登录；0已登录；1登录失效；
    const loginStatus = userStore.loginStatus

    if (!to.meta.needLogin) {
      // 不需要登录, 直接访问页面
      next()
    } else if (loginStatus === -1) {
      // 未登录
      ElMessageBox.alert(i18n.global.t('app.needLogin'), '', {
        showClose: false,
        confirmButtonText: i18n.global.t('com.btnOk'),
        callback: (action) => {
          // 如果有登录页面, 访问登录页面
          if (loginPage) {
            next(loginPath)
          }
        },
      })
    } else if (loginStatus === 1) {
      // 登录失效
      ElMessageBox.alert(i18n.global.t('app.sessionTimeout'), '', {
        showClose: false,
        confirmButtonText: i18n.global.t('com.btnOk'),
        callback: (action) => {
          // 如果有登录页面, 访问登录页面
          if (loginPage) {
            next(loginPath)
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
  // finish progress bar
  // NProgress.done()
})

router.reloadRoutes()

export default router

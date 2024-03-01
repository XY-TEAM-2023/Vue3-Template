/**
 * 默认配置
 */
export const config = {
  logo: {
    /** 是否显示 */
    display: true,
    /** 默认Logo文本, 可以使用国际化 */
    label: 'FS Admin',
    /** 可以是svg，可以是Element的图标名字 */
    icon: '',
    /** 图标大小 */
    iconSize: 20,
  },
  /** 默认语言: zh、en、ko */
  language: 'ko',
  /** 网站模式: admin、website、mobile(该模式下只有手机版本) */
  websiteModel: 'admin',
  /** 是否开启服务器动态路由配置，true为加载登录后服务器返回的路由配置，false为直接加载本地配置 */
  isServerAsyncRoutes: false,
  /** 无手机模式：没有开发手机版时开启 */
  noMobileModel: false,
  localMode: false,
  /** 服务器 */
  server: 'http://127.0.0.1:80',
  /** 给服务器发送请求时，是否需要携带Cookie信息. 服务器Access-Control-Allow-Origin响应头必须指定具体值，不能为‘*’ */
  serverUseCookie: false,
  /** 时区。中国时区：Asia/Shanghai，韩国时区：Asia/Seoul，日本时区：Asia/Tokyo，美国东部时区：America/New_York */
  timezone: 9,
  // server: '',
  /** 导航栏相关 */
  router: {
    /** 登录页面路径, 如果设置了该值, 当页面需要登录才能访问时, 用户点击了确定按钮会自动跳转页面 */
    loginPage: 'login',
    /** 登录成功后访问的页面, 首页, 填写路由里的name */
    homePage: 'team',
    /** 点击已经激活的页面导航时，重新加载页面 */
    clickSamePageReload: false,
    mobile: {
      /** 图标大小 */
      iconSize: 28,
    },
    /** 管理后台相关 */
    admin: {
      /** 背景颜色 */
      backgroundColor: '#fff',
      /** 默认字体颜色 */
      textColor: '#3d6e8f',
      /** 选中后字体颜色 */
      activeTextColor: '#1B9CFB',
      /** 图标大小 */
      iconSize: 18,
    },
  },
  elementPlusIconNames: [],
}

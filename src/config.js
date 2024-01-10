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
  language: 'zh',
  /** 网站模式: admin、website、mobile(该模式下只有手机版本) */
  websiteModel: 'admin',
  /** 是否强制为编译版本，admin模式下: true-使用服务器配置, false-使用本地配置 */
  buildMode: false,
  /** 无手机模式：没有开发手机版时开启 */
  noMobileModel: false,
  localMode: false,
  /** 服务器 */
  server: 'http://127.0.0.1',
  // server: 'http://api.jadesoft.live',
  /** 给服务器发送请求时，是否需要携带Cookie信息. 服务器Access-Control-Allow-Origin响应头必须指定具体值，不能为‘*’ */
  serverUseCookie: false,
  /** 时区。中国时区：Asia/Shanghai，韩国时区：Asia/Seoul，日本时区：Asia/Tokyo，美国东部时区：America/New_York */
  timezone: +8,
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
      backgroundColor: '#2f3243',
      /** 默认字体颜色 */
      textColor: '#fff',
      /** 选中后字体颜色 */
      activeTextColor: '#ffd04b',
      /** 图标大小 */
      iconSize: 18,
    },
  },
  elementPlusIconNames: [],
}

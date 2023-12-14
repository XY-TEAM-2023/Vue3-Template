/**
 * 默认配置
 */
export const config = {
  logo: {
    /** 是否显示 */
    display: true,
    /** 默认Logo文本 */
    label: 'Ruby-Admin',
  },
  /** 默认语言: zh、en、ko */
  language: 'zh',
  /** 网站模式: website、admin、mobile(该模式下只有手机版本) */
  websiteModel: 'admin',
  /** 无手机模式：没有开发手机版时开启 */
  noMobileModel: false,
  /** 服务器 */
  server: 'http://192.168.1.2',
  // server: '',
  /** 导航栏相关 */
  router: {
    /** 登录页面路径, 如果设置了该值, 当页面需要登录才能访问时, 用户点击了确定按钮会自动跳转页面 */
    loginPage: '/login',
    /** 登录成功后访问的页面, 首页 */
    homePage: '/AboutView',
    /** 点击已经激活的页面导航时，重新加载页面 */
    clickSamePageReload: true,
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
}

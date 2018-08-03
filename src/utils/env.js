/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = ''
let routerMode = 'hash'

if (process.env.NODE_ENV == 'development') {
  // baseUrl = 'http://192.168.1.72:8083/'
  baseUrl = 'https://rest.fubt.top/'
} else if (process.env.NODE_ENV == 'production') {
  baseUrl = 'https://rest.fubt.top/'
}

export {
  baseUrl,
  routerMode
}

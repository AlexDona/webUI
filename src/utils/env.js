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
  // baseUrl = 'http://192.168.1.72:8062/' // 刘耀
  // baseUrl = 'http://192.168.1.71:8888/' // 亚男
  baseUrl = 'http://192.168.1.200:8888/' // 亚男
  // baseUrl = 'http://192.168.1.217:8888/' // 爱军
  // baseUrl = 'http://192.168.1.200:8888' // 本地测试
  // baseUrl = 'https://rest.fubt.top/'
  // baseUrl = 'http://192.168.1.77:8888' // 张新杰
  // baseUrl = 'http://192.168.1.235:8046' // 吕冰洋
  // baseUrl = 'http://192.168.1.52:9000' // 滑浩田
  // baseUrl = 'http://192.168.1.235:8046' // 吕冰洋
} else if (process.env.NODE_ENV == 'production') {
  // baseUrl = 'https://rest.fubt.top/'
  baseUrl = 'http://192.168.1.200:8888/' // 爱军
}

export {
  baseUrl,
  routerMode
}

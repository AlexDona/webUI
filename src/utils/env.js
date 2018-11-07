/**
 * 配置编译环境和线上环境之间的切换
 *
 * apiCommonUrl: 域名地址
 * routerMode: 路由模式
 * imgapiCommonUrl: 图片所在域名地址
 *
 */
let apiCommonUrl = '' // api 接口前缀
let socketUrl = '' // socket 接口
let loginSocketUrl = '' // 扫码登录socket
let domain = window.location.href.split('/')// 项目域名
domain.pop()
domain = domain.join('/')
if (!domain.endsWith('#')) {
  domain += '#'
}
console.log(domain)
let routerMode = 'hash'
if (process.env.NODE_ENV == 'development') {
  /* apiCommonUrl --------------------------------------------- */
  // apiCommonUrl = 'http://192.168.1.72:8062/' // 刘耀
  // apiCommonUrl = 'http://192.168.1.71:8888/' // 亚男
  // apiCommonUrl = 'http://192.168.1.217:8888/' // 爱军
  // apiCommonUrl = 'http://192.168.1.77:8888' // 张新杰
  // apiCommonUrl = 'http://192.168.1.52:8888' // 滑浩田
  // apiCommonUrl = 'http://192.168.1.235:8046' // 吕冰洋
  // apiCommonUrl = 'http://192.168.1.252:8103' // 施伯兵
  // apiCommonUrl = 'http://192.168.1.176:8888/' // 帅飞

  apiCommonUrl = 'http://api.new.bzu.com/' // 内部测试
  // apiCommonUrl = 'http://192.168.1.200:8888/' // 本地测试
  // apiCommonUrl = 'http://192.168.1.52:8888/' // 本地测试
  // apiCommonUrl = 'https://rest.fubt.top/'

  /* socketUrl --------------------------------------------- */

  socketUrl = 'wss://ws.bzu.com/market'
  // socketUrl = 'ws://192.168.1.200:8087/market'
  // socketUrl = 'ws://192.168.1.52:8087/market' // socketUrl

  // loginSocketUrl = 'ws://api.new.bzu.com/qrcodeLogin/'
  loginSocketUrl = 'ws://192.168.1.217:8888/qrcodeLogin/'
  /* domain --------------------------------------------- */
} else if (process.env.NODE_ENV == 'testing') {
  apiCommonUrl = 'http://192.168.1.200:8888/' // 本地测试
  socketUrl = 'ws://192.168.1.200:8087/market'
  loginSocketUrl = 'ws://api.new.bzu.com/qrcodeLogin/'
} else if (process.env.NODE_ENV == 'production') {
  /* apiCommonUrl --------------------------------------------- */

  // apiCommonUrl = 'https://rest.fubt.top/'
  // apiCommonUrl = 'http://192.168.1.200:8888/' // 本地测试
  // apiCommonUrl = 'http://api.new.fubt.com/' // 本地测试
  apiCommonUrl = 'https://api.new.bzu.com/' // 内部测试

  /* socketUrl --------------------------------------------- */

  socketUrl = 'wss://ws.bzu.com/market'
  loginSocketUrl = 'ws://api.new.bzu.com/qrcodeLogin/'
  // socketUrl = 'ws://192.168.1.200:8087/market'

  /* domain --------------------------------------------- */
}

export {
  apiCommonUrl,
  socketUrl,
  domain,
  loginSocketUrl,
  routerMode
}

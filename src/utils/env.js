/**
 * 配置编译环境和线上环境之间的切换
 *
 * apiCommonUrl: 域名地址
 * routerMode: 路由模式
 * imgapiCommonUrl: 图片所在域名地址
 *
 */
let apiCommonUrl // api 接口前缀
let socketUrl // socket 接口
let loginSocketUrl // 扫码登录socket
let xDomain = window.location.host.split(':')[0] // 后端专递headers
xDomain = xDomain.startsWith('www') ? xDomain.slice(4) : xDomain
let domain = window.location.href.split('/')// 项目域名
domain.pop()
domain = domain.join('/')
if (!domain.endsWith('#')) {
  domain += '#'
}
if (process.env.NODE_ENV == 'development') {
  /* apiCommonUrl --------------------------------------------- */

  apiCommonUrl = 'http://api.new.bzu.com/' // 内部测试
  // apiCommonUrl = 'http://192.168.1.200:8888/' // 内部测试

  // xDomain = 'new.test.com'
  xDomain = 'bithumber.com'
  socketUrl = 'wss://ws.bzu.com/market'
  // socketUrl = 'ws://192.168.1.200:8087/market'
  // socketUrl = 'ws://192.168.1.52:8087'

  loginSocketUrl = 'wss://api.new.bzu.com/qrcodeLogin/'
  // loginSocketUrl = 'ws://192.168.1.200:8087/qrcodeLogin/'
  // loginSocketUrl = 'ws://192.168.1.210:8888/qrcodeLogin/'
} else if (process.env.NODE_ENV == 'testing') {
  apiCommonUrl = 'http://192.168.1.200:8888/' // 本地测试
  socketUrl = 'ws://192.168.1.200:8087/market'
  loginSocketUrl = 'ws://192.168.1.200:8888/qrcodeLogin/'
} else if (process.env.NODE_ENV == 'production') {
  apiCommonUrl = 'https://api.new.bzu.com/' // 内部测试
  socketUrl = 'wss://ws.bzu.com/market'
  loginSocketUrl = 'wss://api.new.bzu.com/qrcodeLogin/'
}

export {
  apiCommonUrl,
  socketUrl,
  domain,
  loginSocketUrl,
  xDomain
}

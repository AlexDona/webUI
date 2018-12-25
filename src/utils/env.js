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
  // eslint-disable-next-line
  apiCommonUrl = 'http://api.new.bzu.com/' // 内部测试
  xDomain = 'new.bzu.com'
  socketUrl = 'wss://ws.bzu.com/market'
  loginSocketUrl = 'wss://api.new.bzu.com/qrcodeLogin/'

  // eslint-disable-next-line
  /*apiCommonUrl = 'http://192.168.1.200:8888/' // 内部测试
  xDomain = 'kbbt.com'
  socketUrl = 'ws://192.168.1.200:8087/market'
  loginSocketUrl = 'ws://192.168.1.200:8087/qrcodeLogin/'*/

  // eslint-disable-next-line
  /*apiCommonUrl = 'http://192.168.1.210:8888/' // 内部测试
  xDomain = 'me.com'
  socketUrl = 'ws://192.168.1.210:8087/market'
  loginSocketUrl = 'ws://192.168.1.210:8087/qrcodeLogin/'*/
} else if (process.env.NODE_ENV === 'development210') {
  // 210开发环境
  apiCommonUrl = 'http://192.168.1.210:8888/'
  xDomain = 'me.com'
  socketUrl = 'ws://192.168.1.210:8087/market'
  loginSocketUrl = 'ws://192.168.1.210:8087/qrcodeLogin/'
} else if (process.env.NODE_ENV == 'testing') {
  // 200测试环境
  apiCommonUrl = 'http://192.168.1.200:8888/'
  socketUrl = 'ws://192.168.1.200:8087/market'
  loginSocketUrl = 'ws://192.168.1.200:8888/qrcodeLogin/'
} else if (process.env.NODE_ENV == 'production') {
  // 生产环境
  apiCommonUrl = 'https://api.new.bzu.com/'
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

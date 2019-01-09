/**
 * 配置编译环境和线上环境之间的切换
 *
 * apiCommonUrl: 域名地址
 * routerMode: 路由模式
 * imgapiCommonUrl: 图片所在域名地址
 *
 */
let xDomainUrl = window.location.host.split(':')[0] // 后端专递headers
xDomainUrl = xDomainUrl.startsWith('www') ? xDomainUrl.slice(4) : xDomainUrl
let domainUrl = window.location.href.split('/')// 项目域名
domainUrl.pop()
domainUrl = domainUrl.join('/')
if (!domainUrl.endsWith('#')) {
  domainUrl += '#'
}
let targetConfig = {
  domain: domainUrl,
  xDomain: xDomainUrl
}
// eslint-disable-next-line
let devTestConfig = {
  apiCommonUrl: 'http://192.168.1.200:8888/',
  socketUrl: 'ws://192.168.1.200:8087/market',
  loginSocketUrl: 'ws://192.168.1.200:8087/qrcodeLogin/'
}
// eslint-disable-next-line
let dev210Config = {
  apiCommonUrl: 'http://192.168.1.210:8888/',
  socketUrl: 'ws://192.168.1.210:8087/market',
  loginSocketUrl: 'ws://192.168.1.210:8087/qrcodeLogin/'
}
// eslint-disable-next-line
let prodConfig = {
  apiCommonUrl: 'https://api.new.bzu.com/',
  socketUrl: 'wss://ws.bzu.com/market',
  loginSocketUrl: 'wss://api.new.bzu.com/qrcodeLogin/'
}
switch (process.env.NODE_ENV) {
  case 'development':
    // 本地开发
    // targetConfig = {...targetConfig, ...devTestConfig, xDomain: 'new.test.com'}
    // 210开发环境
    // targetConfig = {...dev210Config, xDomain: 'me.com'}
    // 生产环境
    targetConfig = {...prodConfig, xDomain: 'new.bzu.com'}
    break
  // 210开发环境
  case 'development210':
    targetConfig = {...targetConfig, ...dev210Config}
    break
  // 200测试环境
  case 'testing':
    targetConfig = {...targetConfig, ...devTestConfig}
    break
  // 生产环境
  case 'production':
    targetConfig = {...targetConfig, ...prodConfig}
    break
}

let {
  apiCommonUrl,
  socketUrl,
  loginSocketUrl,
  xDomain,
  domain
} = targetConfig
export {
  apiCommonUrl,
  socketUrl,
  loginSocketUrl,
  xDomain,
  domain
}

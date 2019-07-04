/**
 * 配置编译环境和线上环境之间的切换
 * apiCommonUrl: 域名地址
 * routerMode: 路由模式
 * imgapiCommonUrl: 图片所在域名地址
 */
// 后端专递headers
let xDomainUrl = window.location.host.split(':')[0]
xDomainUrl = xDomainUrl.startsWith('www') ? xDomainUrl.slice(4) : xDomainUrl
console.log(window.location.href)
// 项目域名
let domainUrl = `${window.location.href.split('#')[0]}#`
let targetConfig = {
  domain: domainUrl,
  xDomain: xDomainUrl
}

const devTestConfig = {
  // WangShuaiFei
  // apiCommonUrl: 'http://192.168.2.98:8888/',
  // AiQing
  // apiCommonUrl: 'http://192.168.2.88:8888/',
  // HuaHaoTian
  // apiCommonUrl: 'http://192.168.2.52:22224/',
  // ZhangChangXiang
  // apiCommonUrl: 'http://192.168.2.122:8888/',
  // FangRuiChang
  // apiCommonUrl: 'http://192.168.10.9:8888/',
  apiCommonUrl: 'http://192.168.2.200:8888/',
  socketUrl: 'ws://192.168.2.200:8087/market',
  // HuaHaoTian
  // socketUrl: 'ws://192.168.0.52:8087/market',
  loginSocketUrl: 'ws://192.168.2.200:8888/qrcodeLogin/'
}

const dev210Config = {
  apiCommonUrl: 'http://192.168.2.210:8888/',
  socketUrl: 'ws://192.168.2.210:8087/market',
  loginSocketUrl: 'ws://192.168.2.210:8888/qrcodeLogin/'
}
// eslint-disable-next-line
const prodConfig = {
  apiCommonUrl: 'https://s.fubt.co/', // 全局接口 commonURL
  socketUrl: 'wss://market.fubt.co/market', // 行情 socket
  loginSocketUrl: 'wss://qrcode.fubt.co/qrcodeLogin/' // 扫码登录 socket
  // loginSocketUrl: 'wss://s.fubt.co/qrcodeLogin/' // 扫码登录 socket
}
// eslint-disable-next-line
const newProdConfig = {
  apiCommonUrl: 'http://api.coin67.cn/', // 全局接口 commonURL
  socketUrl: 'ws://market.coin67.cn/market', // 行情 socket
  loginSocketUrl: 'ws://market.coin67.cn/qrcodeLogin/' // 扫码登录 socket
}
switch (process.env.NODE_ENV) {
  case 'development':
    // 本地开发
    // targetConfig = {...targetConfig, ...devTestConfig, xDomain: 'new.test.com'}
    // targetConfig = {...targetConfig, ...devTestConfig, xDomain: 'me.com'}
    // 210开发环境
    targetConfig = {...dev210Config, xDomain: 'me.com'}
    // 测试环境 （外网）
    // targetConfig = {...prodConfig, xDomain: 'new.bzu.com'}
    // 生产环境
    // targetConfig = {...prodConfig, xDomain: 'fubt.co'}
    // targetConfig = {...newProdConfig, xDomain: 'coin67.cn'}
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
    // targetConfig = {...targetConfig, ...newProdConfig}
    break
}

const {
  apiCommonUrl,
  socketUrl,
  loginSocketUrl,
  xDomain,
  domain
} = targetConfig
console.log(domain)
export {
  apiCommonUrl,
  socketUrl,
  loginSocketUrl,
  xDomain,
  domain
}

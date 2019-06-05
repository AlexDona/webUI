/**
 * author zhaoxinlei
 * create 20190604
 * description 当前文件为 route 中的常量封装和 方法封装
 */

export const createBaseRoute = ({name, path = `/${name}`, redirect = '', children = [], auth = false, params = {}, props}) => {
  if (!name) return false
  if (children.length) {
    children.forEach(route => {
      if (route.path.startsWith('/')) route.path = route.path.substring(1)
    })
  }
  return {
    path,
    name,
    redirect,
    params,
    caseSensitive: true,
    meta: {
      // 是否进行权限认证
      auth
    },
    props,
    children
  }
}
export const routesVariable = {
  // 众筹
  crowdFunding: 'crowdFunding',
  // 登录
  login: 'login',
  // 设置交易密码
  TransactionPassword: 'TransactionPassword'
}

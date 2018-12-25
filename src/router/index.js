import Vue from 'vue'
import Router from 'vue-router'
// eslint-disable-next-line
import storeCreater from '../vuex'
import routes from './routes'
Vue.use(Router)
const store = storeCreater()

const routerCreator = () => {
  const router = new Router({
    // mode: 'history',
    routes
  })
  router.beforeEach((to, from, next) => {
    if (from.path !== '/login' || from.path !== '/register') {
      store.commit('common/CHANGE_ROUTER_PATH', from.path)
      console.log(store.state.common.routerTo)
    }
    console.log(store.state.user.isLogin)
    console.log(store.state.user.loginStep1Info.userInfo)
    if (store.state.user.loginStep1Info.userInfo) {
      store.commit('user/USER_LOGIN', store.state.user.loginStep1Info)
    }
    // 增加普通用户不能点击OTC导航功能
    if (to.matched.some(m => m.meta.auth)) {
      if (store.state.user.isLogin) {
        if (to.meta.isMerchant) {
          if (store.state.user.loginStep1Info.userInfo.type === 'MERCHANT') {
            next()
          } else {
          }
        } else {
          next()
        }
      } else {
        next({path: '/login', query: {Rurl: to.fullPath}})
      }
    } else {
      next()
    }
  })
  return router
}

export default routerCreator

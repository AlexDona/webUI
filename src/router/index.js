import Vue from 'vue'
import Router from 'vue-router'
// eslint-disable-next-line
import storeCreator from '../vuex'
import routes from './routes'

Vue.use(Router)
const store = storeCreator()

const routerCreator = () => {
  const router = new Router({
    // mode: 'history',
    routes,
    'linkActiveClass': 'active',
    'linkExactActiveClass': 'active'
  })
  router.beforeEach((to, from, next) => {
    if (from.path !== '/login' || from.path !== '/register') {
      store.commit('CHANGE_ROUTER_PATH', from.path)
    }
    if (store.state.user.loginStep1Info.userInfo) {
      store.commit('USER_LOGIN', store.state.user.loginStep1Info)
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
  router.afterEach((to, from) => {
    store.commit('CHANGE_AJAX_READY_STATUS', false)
  })
  return router
}

export default routerCreator

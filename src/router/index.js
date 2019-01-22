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
    routes,
    'linkActiveClass': 'active',
    'linkExactActiveClass': 'active'
  })
  router.beforeEach((to, from, next) => {
    store.commit('CHANGE_AJAX_READY_STATUS', true)
    if (from.path !== '/login' || from.path !== '/register') {
      store.commit('CHANGE_ROUTER_PATH', from.path)
    }
    if (store.state.user.loginStep1Info.userInfo) {
      store.commit('USER_LOGIN', store.state.user.loginStep1Info)
    }
    if (to.path !== '/TradeCenter') {
      console.log(store)
      store.dispatch('SET_PARTNER_INFO_ACTION', store.state.common.language)
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

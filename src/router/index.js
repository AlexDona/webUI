import Vue from 'vue'
import Router from 'vue-router'
import {routesVariable} from './routesVariable'
// eslint-disable-next-line
import storeCreator from '../vuex'
import routes from './routes'
import {getCookie} from '../utils'

Vue.use(Router)
const store = storeCreator()
const routerCreator = () => {
  const router = new Router({
    // mode: 'history',
    routes,
    'linkActiveClass': 'active',
    'linkExactActiveClass': 'active'
  })
  router.beforeEach(async (to, from, next) => {
    if (to.path === `/${routesVariable.home}`) {
      if (store.state.common.language) {
        store.dispatch('GET_ALL_NOTICE_ACTION', store.state.common.language)
      }
    }
    if (from.path !== `/${routesVariable.login}` || from.path !== '/register') {
      store.commit('CHANGE_ROUTER_PATH', from.path)
    }
    const token = getCookie('token')
    if (token && !_.get(store.state.user, 'loginStep1Info.userInfo.notNeedLogin')) {
      store.commit('USER_LOGIN', store.state.user.loginStep1Info)
    }
    if (to.matched.some(m => m.meta.auth)) {
      if (store.state.user.isLogin) {
        next()
      } else {
        next({path: `/${routesVariable.login}`, query: {Rurl: to.fullPath}})` `
      }
    } else {
      next()
    }
    // 登录判断限制
    if (store.state.user.isMobile) {
      if (to.path === `/${routesVariable.login}`) {
        next({path: `/${routesVariable.login}/m`})
      }
    }
    next()
  })
  router.afterEach((to, from) => {
  })
  return router
}

export default routerCreator

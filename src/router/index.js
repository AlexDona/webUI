import Vue from 'vue'
import Router from 'vue-router'
import {routesVariable} from './routesVariable'
// eslint-disable-next-line
import store from '../vuex'
import routes from './routes'
import {getCookie} from '../utils'

Vue.use(Router)
const {home, login, normalLogin, register, invite} = routesVariable
const router = new Router({
  // mode: 'history',
  routes,
  'linkActiveClass': 'active',
  'linkExactActiveClass': 'active'
})
router.beforeEach(async (to, from, next) => {
  // const toPath = to.path.toLowerCase()
  if (to.path === `/${home}`) {
    if (store.state.common.language) {
      store.dispatch('GET_ALL_NOTICE_ACTION', store.state.common.language)
    }
  }
  if (from.path !== `/${login}` || from.path !== `/${register}`) {
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
      next({path: `/${login}`, query: {Rurl: to.fullPath}})
    }
  } else {
    next()
  }
  if (store.state.user.isMobile) {
    // 登录判断限制
    if (to.path === `/${login}/${normalLogin}`) {
      next({path: `/${login}/m`})
    }
    if (to.path.startsWith(`/${login}/${register}`) && to.path !== `/${login}/${register}/default`) {
      next({path: `/${register}/${invite}/${to.path.split('/').reverse()[0]}`})
    }
  }
  next()
})
router.afterEach((to, from) => {
})

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router

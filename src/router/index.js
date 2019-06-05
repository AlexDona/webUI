import Vue from 'vue'
import Router from 'vue-router'
import {routesVariable} from './routesVariable'
// eslint-disable-next-line
import storeCreator from '../vuex'
import routes from './routes'
import ElementUI from 'element-ui'
import that from '../main'

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
    if (to.path === '/home') {
      console.log(store.state.common.language)
      if (store.state.common.language) {
        store.dispatch('GET_ALL_NOTICE_ACTION', store.state.common.language)
      }
    }
    if (from.path !== `/${routesVariable.login}` || from.path !== '/register') {
      store.commit('CHANGE_ROUTER_PATH', from.path)
    }
    if (store.state.user.loginStep1Info.userInfo) {
      store.commit('USER_LOGIN', store.state.user.loginStep1Info)
    }
    // 增加普通用户不能点击OTC导航功能
    if (to.matched.some(m => m.meta.auth)) {
      if (store.state.user.isLogin) {
        // 该账号已被禁止交易OTC，请咨询客服
        await store.dispatch('REFRESH_USER_INFO_ACTION') // 刷新用户信息
        if (to.path === '/OTCPublishAD') {
          if (store.state.user.loginStep1Info.userInfo.otcEnable === 'disable') {
            ElementUI.Message({
              message: that.$t(`M.${'otc_disable_account_tips'}`), // 该账号已被禁止交易OTC，请咨询客服
              type: 'error'
            })
            return false
          }
        }
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

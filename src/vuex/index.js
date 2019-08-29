import common from './Common'
import home from './Home'
import OTC from './OTC'
import personal from './Personal'
import user from './User'
import trade from './Trade'
import footerInfo from './FooterInfo'
import finance from './Finance'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    common,
    home,
    OTC,
    personal,
    user,
    trade,
    footerInfo,
    finance
  }
})
if (module.hot) {
  module.hot.accept([
    './Common/index',
    './Home/index',
    './OTC/index',
    './Personal/index',
    './User/index',
    './Trade/index',
    './FooterInfo/index',
    './Finance/index'
  ], () => {
    const common = require('./Common/index').default
    const home = require('./Home/index').default
    const OTC = require('./OTC/index').default
    const personal = require('./Personal/index').default
    const user = require('./User/index').default
    const trade = require('./Trade/index').default
    const footerInfo = require('./FooterInfo/index').default
    const finance = require('./Finance/index').default
    store.hotUpdate({
      modules: {
        common,
        home,
        OTC,
        personal,
        user,
        trade,
        footerInfo,
        finance
      }
    })
  })
}
export default store

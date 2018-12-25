import common from './Common'
import home from './Home'
import OTC from './OTC'
import personal from './Personal'
import user from './User'
import trade from './Trade'
import footerInfo from './FooterInfo'
import finance from './Finance'
// Vue.use(Vuex)

export default new Vuex.Store({
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

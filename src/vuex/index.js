import common from './Common'
import home from './Home'
import OTC from './OTC'
import personal from './Personal'
// Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    home,
    OTC,
    personal
  }
})

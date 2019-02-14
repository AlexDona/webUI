import App from './App'
import routerCreator from './router'
import {getStore} from './utils'
import 'babel-polyfill'
import storeCreator from './vuex'
import '../static/js/rem'
import VueLazyLoad from 'vue-lazyload'
import Mixin from './mixins'

Vue.use(VueLazyLoad, {
  loading: require('./assets/develop/loading.svg')
})
Vue.mixin(Mixin)

const store = storeCreator()
const router = routerCreator()
// 多语言
const i18n = new VueI18n({
  locale: getStore('language') || store.state.common.defaultLanguage, // 语言标识
  messages: {
    'zh_CN': Object.assign({}, ELEMENT.lang.zhCN, require('../static/lang/zh_CN')),
    'en_US': Object.assign({}, ELEMENT.lang.en, require('../static/lang/en_US')),
    'zh_TW': Object.assign({}, ELEMENT.lang.zhTW, require('../static/lang/zh_TW')),
    'ko_KR': Object.assign({}, ELEMENT.lang.ko, require('../static/lang/ko_KR')),
    'ja_JP': Object.assign({}, ELEMENT.lang.ja, require('../static/lang/ja_JP'))
  }
})
// ELEMENT.locale
ELEMENT.i18n((key, value) => i18n.t(key, value)) // element插件的多语言切换
Vue.config.productionTip = false

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

let vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app', true)

Vue.use({
  vm
})

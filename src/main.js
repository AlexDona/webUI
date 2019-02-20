import App from './App'
import Vue from 'vue'
import routerCreator from './router'
import {getStore} from './utils'
import 'babel-polyfill'
import storeCreator from './vuex'
import '../static/js/rem'
import VueLazyLoad from 'vue-lazyload'
import Mixin from './mixins'
import ElementUI from 'element-ui'
import 'animate.css'
import 'element-ui/lib/theme-chalk/index.css'
import '../static/css/common.css'
import '../static/css/reset.css'
import lang from 'element-ui/lib/locale/'
import VueI18n from 'vue-i18n'
import VueClipboard from 'vue-clipboard2'
import zhCN from 'element-ui/lib/locale/lang/zh-CN'
import enUS from 'element-ui/lib/locale/lang/en'
import zhTW from 'element-ui/lib/locale/lang/zh-TW'
import koKR from 'element-ui/lib/locale/lang/ko'
import jaJP from 'element-ui/lib/locale/lang/ja'
import Vuex from 'vuex'
// eslint-disable-next-line
import $ from 'jquery'
// eslint-disable-next-line
import _ from 'lodash'
Vue.use(VueLazyLoad, {
  loading: require('./assets/develop/loading.svg')
})

Vue.mixin(Mixin)
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VueClipboard)
const store = storeCreator()
const router = routerCreator()
console.log(lang)
// 多语言
const i18n = new VueI18n({
  locale: getStore('language') || store.state.common.defaultLanguage, // 语言标识
  messages: {
    'zh_CN': Object.assign({}, zhCN, require('../static/lang/zh_CN')),
    'en_US': Object.assign({}, enUS, require('../static/lang/en_US')),
    'zh_TW': Object.assign({}, zhTW, require('../static/lang/zh_TW')),
    'ko_KR': Object.assign({}, koKR, require('../static/lang/ko_KR')),
    'ja_JP': Object.assign({}, jaJP, require('../static/lang/ja_JP'))
  }
})
// ELEMENT.locale
ElementUI.i18n((key, value) => i18n.t(key, value)) // element插件的多语言切换
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

export default vm

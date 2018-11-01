// import Vue from 'vue'
import App from './App'
import router from './router'
import {getStore} from './utils'
// import '../static/js/rem'
// css
// import '../static/css/reset.css'
import 'babel-polyfill'
import store from './vuex'
import '../static/js/rem'

import vwebp from 'vue-webp2'
Vue.use(vwebp)

console.log(store)
// import '../static/css/scss/index.scss'

// 多语言
const i18n = new VueI18n({
  locale: getStore('language') || store.state.common.defaultLanguage, // 语言标识
  messages: {
    'zh_CN': require('../static/lang/zh_CN'),
    'en_US': require('../static/lang/en_US'),
    'zh_TW': require('../static/lang/zh_TW'),
    'ko_KR': require('../static/lang/ko_KR'),
    'ja_JP': require('../static/lang/ja_JP')
  }
})

Vue.config.productionTip = false

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

// import Vue from 'vue'
import App from './App'
import router from './router'
import {getStore} from './utils'
// import '../static/js/rem'
// css
// import '../static/css/reset.css'

import 'babel-polyfill'
import store from './vuex'

// import '../static/css/scss/index.scss'

// 多语言
const i18n = new VueI18n({
  locale: getStore('language') || 'zh_CN', // 语言标识
  messages: {
    'zh_CN': require('../static/lang/zh_CN'),
    'en_US': require('../static/lang/en_US')
    // 'zh_TW': require('../static/lang/fan')
    // 'ko_KR': require('../static/lang/han')
  }
})

Vue.config.productionTip = false

let vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
Vue.use({
  vm
})

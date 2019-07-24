import App from './App'
import Vue from 'vue'
import routerCreator from './router'
import {getStore} from './utils'
import storeCreator from './vuex'
import '../static/js/rem'
import './global'
import Mixin from './mixins'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import lang from 'element-ui/lib/locale/'
import VueI18n from 'vue-i18n'
import VueClipboard from 'vue-clipboard2'
import Vuex from 'vuex'
// import FastClick from 'fastclick'
// eslint-disable-next-line
import $ from 'jquery'
// eslint-disable-next-line
import _ from 'lodash'
import {
  Pagination,
  Dialog,
  Autocomplete,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxGroup,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  DatePicker,
  Popover,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Icon,
  Progress,
  Loading,
  MessageBox,
  Message,
  Upload
} from 'element-ui'
import 'animate.css'
import 'element-ui/lib/theme-chalk/index.css'
import '../static/css/common.css'
import '../static/css/list/Common/HeaderCommon/HeaderCommon.css'
import '../static/css/reset.css'

import zhCN from 'element-ui/lib/locale/lang/zh-CN'
import enUS from 'element-ui/lib/locale/lang/en'
import zhTW from 'element-ui/lib/locale/lang/zh-TW'
import koKR from 'element-ui/lib/locale/lang/ko'
import jaJP from 'element-ui/lib/locale/lang/ja'
import vi from 'element-ui/lib/locale/lang/vi'

Vue.use(Pagination)
  .use(Dialog)
  .use(Autocomplete)
  .use(Input)
  .use(Radio)
  .use(RadioGroup)
  .use(RadioButton)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Select)
  .use(Option)
  .use(Button)
  .use(Table)
  .use(TableColumn)
  .use(DatePicker)
  .use(Popover)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Form)
  .use(FormItem)
  .use(Tabs)
  .use(TabPane)
  .use(Icon)
  .use(Progress)
  .use(Loading.directive)
  .use(Upload)
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.prototype.$t = Message
Vue.mixin(Mixin)
Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VueClipboard)
Vue.component(CollapseTransition.name, CollapseTransition)
Vue.component(Message)

const store = storeCreator()
const router = routerCreator()
console.log(lang)
// 多语言
const i18n = new VueI18n({
  locale: getStore('language') || store.state.common.defaultLanguage, // 语言标识
  messages: {
    'zh_CN': {...zhCN, ...require('../static/lang/zh_CN')},
    'en_US': {...enUS, ...require('../static/lang/en_US')},
    'zh_TW': {...zhTW, ...require('../static/lang/zh_TW')},
    'ko_KR': {...koKR, ...require('../static/lang/ko_KR')},
    'ja_JP': {...jaJP, ...require('../static/lang/ja_JP')},
    'vi_VN': {...vi, ...require('../static/lang/vi_VN')}
  }
})
lang.i18n((key, value) => i18n.t(key, value)) // element插件的多语言切换
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
// FastClick.attach(document.body)
Vue.use({
  vm
})

export default vm

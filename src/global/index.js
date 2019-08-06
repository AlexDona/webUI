/**
 * author zhaoxinlei
 * create 20190605
 * description 当前页面为全局组件
 */
import Vue from 'vue'
import PayPassDialog from '../components/Common/GlobalPayPassWordDialog.vue'
import Iconfont from '../components/Common/IconFontCommon.vue'
import VueClipboard from 'vue-clipboard2'
import QrCode from '../components/Common/Qrcode'
Vue.component('PayPassDialog', PayPassDialog)
Vue.component('Iconfont', Iconfont)
Vue.use(VueClipboard)
Vue.component('PayPassDialog', PayPassDialog)
Vue.component('Iconfont', Iconfont)
Vue.component('QrCode', QrCode)

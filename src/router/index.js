import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const HomeCenter = r => require.ensure([], () => r(require('@/components/Home/HomeCenter')), 'home-center')
// 个人中心
const PersonalCenter = r => require.ensure([], () => r(require('@/components/Personal/PersonalCenter')), 'user-center')
const OTCCenter = r => require.ensure([], () => r(require('@/components/OTC/OTCCenter')), 'otc-center')
export default new Router({
  routes: [
    {
      // 首页
      path: '/',
      // name: 'HomeCenter',
      component: HomeCenter
    },
    {
      // 个人中心
      path: '/PersonalCenter',
      // name: 'PersonalCenter',
      component: PersonalCenter
    },
    {
      path: '/OTCCenter',
      // name: 'OTCCenter',
      component: OTCCenter
    }
  ]
})

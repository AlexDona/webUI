import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const HomeCenter = r => require.ensure([], () => r(require('@/components/Home/HomeCenter')), 'home-center')
const OTCCenter = r => require.ensure([], () => r(require('@/components/OTC/OTCCenter')), 'otc-center')

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'HomeCenter',
      component: HomeCenter
    },
    {
      path: '/OTCCenter',
      // name: 'OTCCenter',
      component: OTCCenter
    }
  ]
})

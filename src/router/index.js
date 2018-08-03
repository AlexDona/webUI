import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const HomeCenter = r => require.ensure([], () => r(require('@/components/Home/HomeCenter')), 'home-center')

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'HomeCenter',
      component: HomeCenter
    }
  ]
})

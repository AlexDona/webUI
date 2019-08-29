/**
 * author: zhaoxinlei
 * create: 20190731
 * description: 当前页面为 H5 相关路由
 */
import {createBaseRoute, routesVariable as routers, routesVariable} from './routesVariable'

const {register, invite, registerSuccess, login, forgetPass} = routesVariable
export default [
  // 注册
  {
    ...createBaseRoute({
      name: `${register}m`,
      path: `/${register}/m/:inviteId`,
      props: true
    }),
    component: () => import('@com/H5/TheRegister_M.vue')
  },
  // 注册成功
  {
    ...createBaseRoute({
      name: `${register}m/${registerSuccess}`,
      path: `/${registerSuccess}/m/${register}/:inviteId`,
      props: true
    }),
    component: () => import('@com/H5/TheRegisterSuccess_M.vue')
  },
  // 邀请注册
  {
    ...createBaseRoute({
      name: `${register}/${invite}/:showId`,
      props: true
    }),
    component: () => import('@/pages/InvitationRegister')
  },
  // 登录
  {
    ...createBaseRoute({
      name: `${login}/m`
      // path: `${login}/m`
    }),
    component: () => import('@com/H5/TheLogin_M.vue')
  },
  // 忘记密码
  {
    ...createBaseRoute({
      name: `${forgetPass}`,
      path: `/${forgetPass}/m`,
      children: [
        {
          path: '',
          redirect: routers.forgetPassStep1
        },
        // 第一步
        {
          ...createBaseRoute({
            name: `${routers.forgetPassStep1}`,
            path: `${routers.forgetPassStep1}`
          }),
          component: () => import(/* webpackChunkName: "forgetPass1" */ '../components/H5/TheForgetPass_M/TheForgetPassStep1_M')
        },
        // 第二步
        {
          ...createBaseRoute({
            name: `${routers.forgetPassStep2}`,
            path: `${routers.forgetPassStep2}/:username`,
            props: true
          }),
          component: () => import(/* webpackChunkName: "forgetPass2" */ '../components/H5/TheForgetPass_M/TheForgetPassStep2_M')
        },
        // 第三步
        {
          ...createBaseRoute({
            name: `${routers.forgetPassStep3}`,
            path: `${routers.forgetPassStep3}/:username`,
            props: true
          }),
          component: () => import(/* webpackChunkName: "forgetPass3" */ '../components/H5/TheForgetPass_M/TheForgetPassStep3_M')
        }
      ]
    }),
    component: () => import(/* webpackChunkName: "forget-password" */ '../components/H5/TheForgetPass_M/TheForgetPass_M')
  },
  {
    path: '/downloadApp',
    component: () => import('@/pages/DownloadApp')
  }
]

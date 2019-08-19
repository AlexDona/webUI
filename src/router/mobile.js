/**
 * author: zhaoxinlei
 * create: 20190731
 * description: 当前页面为 H5 相关路由
 */
import {createBaseRoute, routesVariable} from './routesVariable'

const {register, invite, registerSuccess, login} = routesVariable
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
  }
]

/**
 * author: zhaoxinlei
 * create: 20190327
 * description: 当前页面为 user(登录、注册) 相关路由
 */
import {createBaseRoute, routesVariable as routers} from './routesVariable'

export default [
  // 登录、注册
  {
    ...createBaseRoute({
      name: `${routers.login}`,
      children: [
        {
          path: '',
          redirect: routers.normalLogin
        },
        {
          ...createBaseRoute({
            name: routers.normalLogin,
            path: routers.normalLogin
          }),
          component: () => import(/* webpackChunkName: "normal-login" */ '../components/User/LoginAndRegister/TheLogin/TheNormalLogin.vue')
        },
        {
          ...createBaseRoute({
            name: routers.scanLogin,
            path: routers.scanLogin
          }),
          component: () => import(/* webpackChunkName: "qr-code-login" */ '../components/User/LoginAndRegister/TheLogin/TheQRCodeLogin.vue')
        },
        // 注册
        {
          ...createBaseRoute({
            name: `${routers.register}`,
            path: `${routers.register}/:inviteId`,
            props: true
          }),
          component: () => import(/* webpackChunkName: "register" */ '../components/User/LoginAndRegister/Register/TheRegister.vue')
        }
      ]
    }),
    component: () => import(/* webpackChunkName: "login" */ '../components/User/LoginAndRegister/TheLoginAndRegister')
  },
  // 注册成功
  {
    ...createBaseRoute({
      name: `${routers.register}/${routers.registerSuccess}`,
      path: `/${routers.registerSuccess}/${routers.register}/:inviteId`,
      props: true
    }),
    component: () => import(/* webpackChunkName: "register-success" */ '../components/User/LoginAndRegister/Register/TheRegisterSuccess')
  },
  // 忘记密码
  {
    ...createBaseRoute({
      name: `${routers.forgetPass}`,
      path: `/${routers.forgetPass}`,
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
          component: () => import(/* webpackChunkName: "forgetPass1" */ '../components/User/ForgetPass/TheForgetPassStep1')
        },
        // 第二步
        {
          ...createBaseRoute({
            name: `${routers.forgetPassStep2}`,
            path: `${routers.forgetPassStep2}/:username`,
            props: true
          }),
          component: () => import(/* webpackChunkName: "forgetPass2" */ '../components/User/ForgetPass/TheForgetPassStep2')
        },
        // 第三步
        {
          ...createBaseRoute({
            name: `${routers.forgetPassStep3}`,
            path: `${routers.forgetPassStep3}/:username`,
            props: true
          }),
          component: () => import(/* webpackChunkName: "forgetPass3" */ '../components/User/ForgetPass/TheForgetPassStep3')
        }
      ]
    }),
    component: () => import(/* webpackChunkName: "forget-password" */ '../components/User/ForgetPass/TheForgetPass')
  }
]

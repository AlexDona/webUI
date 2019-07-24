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
        // 手机注册
        {
          ...createBaseRoute({
            name: `${routers.register}`,
            path: `${routers.register}/:inviteId`,
            props: true
          }),
          component: () => import(/* webpackChunkName: "register" */ '../components/User/LoginAndRegister/Register/TheRegister.vue')
        }
        // {
        //   ...createBaseRoute({
        //     name: routers.confirmUserInfo,
        //     path: `${routers.confirmUserInfo}/:username`,
        //     props: true
        //   }),
        //   component: () => import(/* webpackChunkName: "confirm-user-info" */ '../../components/User/LoginAndRegister/ConfirmUserInfo.vue')
        // }
      ]
    }),
    component: () => import(/* webpackChunkName: "login" */ '../components/User/LoginAndRegister/TheLoginAndRegister')
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
          ...createBaseRoute({ name: `${routers.forgetPassStep2}`, path: `${routers.forgetPassStep2}/:username`, props: true }),
          component: () => import(/* webpackChunkName: "forgetPass2" */ '../components/User/ForgetPass/TheForgetPassStep2')
        },
        // 第三步
        {
          ...createBaseRoute({ name: `${routers.forgetPassStep3}`, path: `${routers.forgetPassStep3}/:username`, props: true }),
          component: () => import(/* webpackChunkName: "forgetPass3" */ '../components/User/ForgetPass/TheForgetPassStep3')
        }
      ]
    }),
    component: () => import(/* webpackChunkName: "forget-password" */ '../components/User/ForgetPass/TheForgetPass')
  }
  // 注册
  // {
  //   ...createBaseRoute({name: 'register', path: '/register/:inviteId', props: true}),
  //   component: () => import(/* webpackChunkName: "register" */ '../../views/User/Register.vue')
  // },
  // // 注册成功
  // {
  //   ...createBaseRoute({name: `${routers.registerSuccess}`}),
  //   component: () => import(/* webpackChunkName: "registerSuccess" */ '../../components/User/Register/RegisterSuccess.vue')
  // },
  // // 找回密码
  // {
  //   ...createBaseRoute({name: `${routers.forgetPass}`}),
  //   children: [
  //     // 第一步
  //     {
  //       ...createBaseRoute({name: `${routers.forgetPass1}`, path: ''}),
  //       component: () => import(/* webpackChunkName: "forgetPass1" */ '../../components/User/ForgetPass/ForgetPassStep1.vue')
  //     },
  //     // 第二步
  //     {
  //       ...createBaseRoute({name: `${routers.forgetPass2}`, path: `${routers.forgetPass2}/:username`, props: true}),
  //       component: () => import(/* webpackChunkName: "forgetPass2" */ '../../components/User/ForgetPass/ForgetPassStep2.vue')
  //     },
  //     // 第三步
  //     {
  //       ...createBaseRoute({name: `${routers.forgetPass3}`, path: `${routers.forgetPass3}/:username`, props: true}),
  //       component: () => import(/* webpackChunkName: "forgetPass3" */ '../../components/User/ForgetPass/ForgetPassStep3.vue')
  //     },
  //     // 第四步
  //     {
  //       ...createBaseRoute({name: `${routers.forgetPass4}`, path: `${routers.forgetPass4}`, props: true}),
  //       component: () => import(/* webpackChunkName: "forgetPass4" */ '../../components/User/ForgetPass/ForgetPassStep4.vue')
  //     }
  //   ],
  //   component: () => import(/* webpackChunkName: "forgetPass" */ '../../views/User/ForgetPass.vue')
  // }
]

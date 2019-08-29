/**
 * author: zhaoxinlei
 * create: 20190829
 * description: 当前js 为 个人中心相关 router
 */

export default [
  {
    // 银行卡设置
    path: '/AddBankCard',
    name: 'AddBankCard',
    component: () => import('@com/Personal/AccountReceivableAccount/AddBankCard'),
    meta: {
      auth: true
    }
  },
  {
    // 支付宝设置
    path: '/AddSetAlipay',
    // name: 'AddSetAlipay',
    component: () => import('@com/Personal/AccountReceivableAccount/AddSetAlipay'),
    meta: {
      auth: true
    }
  },

  {
    // 西联汇款设置
    path: '/AddWesternUnion',
    // name: 'AddWesternUnion',
    component: () => import('@com/Personal/AccountReceivableAccount/AddWesternUnion'),
    meta: {
      auth: true
    }
  },

  {
    // paypal设置
    path: '/AddSetPaypal',
    // name: 'AddSetPaypal',
    component: () => import('@com/Personal/AccountReceivableAccount/AddSetPaypal'),
    meta: {
      auth: true
    }
  },

  {
    // 安全邮箱设置
    path: '/SecureEmail',
    // name: 'SecureEmail',
    component: () => import('@com/Personal/UserSecuritySettings/UserSecureEmail'),
    meta: {
      auth: true
    }
  },
  {
    // 微信设置
    path: '/AddWeChat',
    // name: 'AddWeChat',
    component: () => import('@com/Personal/AccountReceivableAccount/AddWeChat'),
    meta: {
      auth: true
    }
  },

  {
    // 设置交易密码
    path: '/TransactionPassword',
    // name: 'TransactionPassword',
    component: () => import('@com/Personal/UserSecuritySettings/UserTransactionPassword'),
    meta: {
      auth: true
    }
  },
  {
    // 开通vip页面
    path: '/openVIP',
    component: () => import('@/pages/VIP/OpenVIP')
  },

  {
    // VIP
    path: '/VipMainContent',
    // name: 'VipMainContent',
    component: () => import('@/pages/VIP/VipMainContent')
  },

  {
    // 修改登录密码
    path: '/LoginPassword',
    // name: 'LoginPassword',
    component: () => import('@com/Personal/UserSecuritySettings/UserLoginPassword'),
    meta: {
      auth: true
    }
  },

  {
    // 绑定谷歌验证
    path: '/GoogleBinding',
    // name: 'GoogleBinding',
    component: () => import('@com/Personal/UserSecuritySettings/UserGoogleBinding'),
    meta: {
      auth: true
    }
  },

  {
    // 安全手机设置
    path: '/SecurePhone',
    // name: 'SecurePhone',
    component: () => import('@com/Personal/UserSecuritySettings/UserSecurePhone'),
    meta: {
      auth: true
    }
  }
]

import mutations from './mutations'
import actions from './action'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // 个人中心用户信息
  // userInfo: {
  //   'code': 200, // 返回状态
  //   'msg': '成功', //
  //   'time': 1527849930319, // 时间
  //   'data': {
  //     'user': {
  //       'uid': 4, // 用户UID
  //       'member': false, // 会员
  //       'memberGrade': 123456, // 会员等级
  //       'loginName': '13838282547', // 登录名
  //       'email': '15994026836@163.com', // 邮箱
  //       'telePhone': '13838282547', // 手机号
  //       'google': false, // 谷歌验证
  //       'loginPassword': '', // 登录密码
  //       'tradePassword': null, // 交易密码
  //       'realName': '杨孝喜', // 真实姓名 null未认证
  //       'hasrealvaliDate': false, // 是否实名认证false:未实名，true实名；
  //       'userIdentity': false, // 是否高级认证
  //       'hasrealvaliDateTime': 1512019593000,
  //       'safetyGrade': '', // 0低 1中 2高
  //       'identification': '412726199509016752', // 证件号码
  //       'emailBind': true, // 邮箱状态默认false未绑定 true已绑定0关闭 1开启
  //       'telePhoneBind': true, // 是否绑定手机false true  0关闭 1开启
  //       'googleBind': false, // 是否绑定谷歌验证0 未绑定 1已绑定 2开启 3关闭
  //       'tradePasswordType': null, // 交易密码状态 null空 1有交易密码
  //       'identificationType': 0, // 证件类型 0身份证 1护照
  //       'googleUrl': '4KXXI6KBIIJ76NVX',
  //       'areaCode': '86',
  //       'lastLoginTime': 1534150923000, // 最后登录时间
  //       'registerTime': 1512005133000, // 注册时间
  //       'ip': null,
  //       'status': 1,
  //       'showId': 81240
  //     },
  //     'token': ''
  //   }
  // },
  // 个人中心默认显示第一个
  userCenterActiveName: 'assets',
  // 个人中心默认显示第一个
  fiatMoneyOrdersName: 'trade-order',
  // 安全中心默认
  refSecurityCenterStatus: false,
  // 收款方式
  refsAccountCenterStatus: false
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}

import mutations from './mutations'
import actions from './action'
import {getStore} from '../utils'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // 网页主题
  theme: getStore('theme') || 'night',
  // 国际化语言
  language: 'zh_CN',
  // 折算货币
  activeConvertCurrency: 'CNY',
  // 首页 banner 图背景
  bannerBackgroundImage: 'https://fubt.oss-ap-southeast-1.aliyuncs.com/fubt/upload/args/0c2a11e3ee9145819210f96f004ec9f2n.jpg',
  // 首页banner 默认 背景图
  bannerDefaultBackground: 'https://fubt.oss-ap-southeast-1.aliyuncs.com/fubt/upload/args/0c2a11e3ee9145819210f96f004ec9f2n.jpg',
  // 首页banner激活
  bannerActive: false,
  // 当前选中交易对
  activeSymbol: {
    id: 0, // 交易对id
    image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    sellsymbol: 'FUC', // 币种简称
    sellname: '富链', // 币种全程
    area: 'BTC', // 交易区
    price: 0.21761239, // 最新价格
    high: 0.21761232, // 最高价
    low: 0.21761232, // 最低价
    volume: 21761232, // 24小时成交量
    rose: -0.16123, // 涨跌
    tendency: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59, 0.1, 2.35],
    hot: false // 是否为最热交易对
  },
  globalCollectList: JSON.parse(getStore('collectList')) || [], // 收藏列表
  // 个人中心用户信息
  userInfo: {
    'code': 200, // 返回状态
    'msg': '成功', //
    'time': 1527849930319, // 时间
    'data': {
      'user': {
        'uid': 81240, // 用户UID
        'member': false, // 会员
        'memberGrade': 123456, // 会员等级
        'loginName': '13838282547', // 登录名
        'email': '15994026836@163.com', // 邮箱
        'telePhone': '13838282547', // 手机号
        'google': false, // 谷歌验证
        'loginPassword': '', // 登录密码
        'tradePassword': null, // 交易密码
        'realName': '杨孝喜', // 真实姓名 null未认证
        'hasrealvaliDate': true, // 是否实名认证false:未实名，true实名；
        'userIdentity': true, // 是否高级认证
        'hasrealvaliDateTime': 1512019593000,
        'safetyGrade': '', // 0低 1中 2高
        'identification': '412726199509016752', // 证件号码
        'emailBind': false, // 邮箱状态默认false未绑定 true已绑定0关闭 1开启
        'telePhoneBind': false, // 是否绑定手机false true  0关闭 1开启
        'googleBind': '', // 是否绑定谷歌验证0 未绑定 1已绑定 2开启 3关闭
        'tradePasswordType': null, // 交易密码状态 null空 1有交易密码
        'identificationType': 0, // 证件类型 0身份证 1护照
        'googleUrl': 'otpauth://totp/FUBT:81240?secret=4KXXI6KBIIJ76NVX',
        'areaCode': '86',
        'lastLoginTime': 1534150923000, // 最后登录时间
        'registerTime': 1512005133000, // 注册时间
        'ip': null
      },
      'token': ''
    }
  }
}

export default new Vuex.Store({
  state,
  // getters,
  actions,
  mutations
})

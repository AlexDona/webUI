import mutations from './mutations'
import actions from './actions'
import {getStore} from '../../utils'
import getters from './getters'
const state = {
  title: '', // 网站title
  countDownResetStatus: false, // 倒计时重置状态
  theme: getStore('theme') || 'night',
  countryAreaList: [], // 国家列表（国家码）
  defaultLanguage: 'en_US',
  // 国际化语言
  language: getStore('language') || 'en_US',
  activeLanguage: '',
  mainColor: {
    $mainNightBgColor: '#1c1f32',
    $mainDayBgColor: '#fff'
  },
  // 折算货币
  activeConvertCurrency: 'CNY',
  // 折算货币税率列表
  currencyRateList: [],
  // 当前折算货币obj
  activeConvertCurrencyObj: {},
  previousSymbol: {}, // 上一个交易对
  // 当前选中交易对
  activeSymbol: {
    id: '', // 交易对id 正常数据为 'fbtbtc'
    tradeId: '',
    image: '', // 币种图标
    sellsymbol: '', // 币种简称
    sellname: '', // 币种全程
    area: '', // 交易区
    price: 0, // 最新价格
    high: 0, // 最高价
    low: 0, // 最低价
    volume: 0, // 24小时成交量
    rose: 0, // 涨跌
    tendency: [0, 0, 0, 0, 0, 0, 0, 0],
    hot: false // 是否为最热交易对
  },
  activeTradeArea: {}, // 当前选中交易区
  reqRefreshStatus: true, // socket刷新
  klineAjaxData: {
    depthData: {},
    buyAndSellData: {
      buys: {
        list: [],
        highestAmount: ''
      },
      latestDone: {
        price: '',
        rose: ''
      },
      sells: {
        list: [],
        highestAmount: ''
      }
    },
    tardeRecordList: [], // 交易记录
    tradeMarketList: [], // 交易区列表
    depthDecimal: {} // 交易对深度小数位数据
  },
  // socket 数据
  socketData: {
    depthData: {},
    buyAndSellData: {
      buys: {
        list: [],
        highestAmount: ''
      },
      latestDone: {
        price: '',
        rose: ''
      },
      sells: {
        list: [],
        highestAmount: ''
      }
    },
    // 交易对名称
    symbol: '',
    tardeRecordList: [], // 交易记录
    tradeMarkeContentItem: {} // 交易区单项
  },
  // 全局存储的选中的交易对小数位
  globalCheckedBits: '',
  routerTo: '', // 路由跳转
  withdrawDepositList: [], // 我的资产列表信息数据
  userRefreshUserList: [], // 刷新用户信息
  userInfoRefreshStatus: false, // 用户信息接口刷新状态
  // logoSrc: require('../../assets/develop/logo.png'),
  logoSrc: '',
  footerInfo: {
    footerInfo1: {},
    footerInfo2: {},
    configInfo: {}
  },
  isSymbolChanged: false,
  // 全局loading
  isAjaxReady: false,
  clientWidth: 0,
  newsItemId: '',
  // 交易密码是否被锁定
  isLockedPayPassword: false
}

export default {
  state,
  getters,
  actions,
  mutations
}

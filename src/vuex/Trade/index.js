import mutations from './mutations'
import actions from './actions'
import getters from './getters'
// import {getStoreWithJson} from '../../utils'
// Vue.use(Vuex)

const state = {
  // 刷新委单状态
  refreshEntrustStatus: false,
  // 币币交易市场当前选中交易区id
  activeTabId: '',
  // 当前选中交易区
  activeTabSymbolStr: '',
  // 用户手动选择买卖价格
  activePriceItem: '',
  // 中部当前交易对选中数据
  middleTopData: {},
  // 监控getActiveSymbolData是否返回
  isReturnSymbolData: false,
  // 中部当前交易对选中socket数据
  middleTopSocketData: {},
  // 是否从其他页面跳转到币币交易页面
  isJumpToTradeCenter: false,
  // 跳转到币币交易时带来的当前交易对
  jumpSymbol: {},
  // K线数据是否得到
  isKlineDataReady: false,
  // 限价买卖数量、单价
  limitExchange: {
    buyPrice: 0,
    buyCount: 0,
    sellPrice: 0,
    sellCount: 0
  },
  // 市价买卖数量、单价
  marketExchange: {
    buyCount: 0,
    sellCount: 0
  },
  // 获取服务器是否展示活动页面
  serverData: {
    serverTime: '',
    nextCountDown: '',
    // 是否显示活动页面
    isShowServerPort: false,
    // 是否显示限价交易
    isLimitShow: false
  },
  activity: {
    // 活动规则
    'activityRule': 'https://www.fubt.com/#/NewsAndNoticeItem/298216019963412480',
    // 买方币种名称
    'buyCoinName': 'FBT',
    // 活动结束倒计时 (毫秒)
    'endTime': '899581',
    // 兑换比例
    'exchangeRatio': '0.98',
    // 单人限额
    'limitAmount': '1400',
    // 是否开启限价交易
    'limitEntrustEnabled': false,
    // 项目简介
    'projectDesc': 'https://www.fubt.com/#/NewsAndNoticeItem/296223099525791744',
    // 项目名称
    'projectName': 'BNB PRE',
    // 本轮发行数量
    'publishCount': '20000',
    // 卖方币种名称
    'sellCoinName': 'BNB',
    // 遮罩背景图
    'shadeImg': 'https://fubt-3.oss-cn-hongkong.aliyuncs.com/bb59d316-fa5e-4a44-835b-2490c6e67a47',
    // 是否显示倒计时
    'showCountDown': true,
    // 活动开始时间
    'startTime': 0,
    // 状态 可取值: coming、 ongoing
    'status': 'ongoing',
    // 轮次介绍
    'stepDesc': '1-3',
    // 商户交易ID
    'tradeId': '510161764231413760'
  },
  // 主页显示内容（kline、depth）
  showKlineOrDepth_S: 'kline'
}
export default {
  state,
  getters,
  actions,
  mutations
}

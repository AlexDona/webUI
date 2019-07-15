import mutations from './mutations'
import actions from './action'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  reRenderTradingListStatus: false, // 重新渲染交易中订单列表状态
  // 交易中的订单
  legalTraderTradingList: [],
  legalTraderTradingReflashStatus: false, // 刷新状态
  //  已完成的订单
  legalTraderCompletedList: [],
  legalTraderCompletedReflashStatus: false,
  //  已取消的订单
  legalTraderCanceledList: [],
  legalTraderCancelReflashStatus: false,
  //  冻结中的订单
  legalTraderForzenList: [],
  legalTraderFrozenReflashStatus: false,
  //  委托订单
  legalTraderEntrustList: [],
  legalTraderEntrustReflashStatus: false,
  // 个人中心默认显示第一个
  userCenterActiveName: 'assets',
  // 个人中心默认显示第一个
  fiatMoneyOrdersName: 'trade-order',
  // 安全中心默认
  refSecurityCenterStatus: false,
  // 收款方式
  refsAccountCenterStatus: false,
  // 每页数据量
  legalTradePageSize: 5,
  // 开始页码
  legalTradePageNum: 1,
  // 总页数
  legalTradePageTotals: 0,
  // 法币订单状态变化
  legalTraderOrderStatus: false,
  // 跳转到新增提币地址的参数
  paramOfJumpToAddWithdrawAdress: '',
  // 我的资产跳转账单明细
  assetJumpStatementDetails: '',
  // 我的资产跳转账单明细状态类型提币或者充值
  assetJumpStatementDetailsType: '',
  // USDT 币种 id
  USDT_COIN_ID_S: '501762327108911104',
  // 全局 链名称
  activeLinkName_S: '',
  linkNames_S: [
    {
      label: 'OMNI',
      value: 'OMNI',
      disabled: false
    },
    {
      label: 'ERC20',
      value: 'ERC20',
      disabled: false
    },
    {
      label: 'TRC20',
      value: 'TRC20',
      disabled: true
    }
  ],
  // 清除法币订单交易中订单定义的数组数据状态-默认是false，当为true时候调用清除数据的方法
  clearTradingOrderArrDataStatus: false
}

export default {
  state,
  // getters,
  actions,
  mutations
}

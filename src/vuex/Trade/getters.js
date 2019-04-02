export default {
  // 是否需要限价交易
  isNeedLimitExchange_G (state) {
    return state.middleTopData.id !== 'windows'
  }
}

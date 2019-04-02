export default {
  // 是否需要限价交易
  isNeedLimitExchange_G (state) {
    const {middleTopData: {id}} = state
    return id !== 'windows'
  }
}

import {xDomain} from '../../utils/env'

export default {
  // 是否需要限价交易
  isNeedLimitExchange_G (state) {
    const {middleTopData: {id}} = state
    return id !== 'ystusdt' && id !== 'windows' && id !== 'hfbzu'
  },
  // 是否显示YST
  isNeedYST () {
    return xDomain === 'fubt.co' || xDomain === 'fubt.com' || xDomain === 'fubt.top' || xDomain === 'new.test.com' || xDomain === 'new.bzu.com'
  }
}

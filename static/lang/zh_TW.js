import {fromApi} from './fromApi/zh_TW'
import {common} from './common/zh_TW'
import {footerInfo} from './footerInfo/zh_TW'
import {home} from './home/zh_TW'
import {OTC} from './OTC/zh_TW'
import {personal} from './personal/zh_TW'
import {trade} from './trade/zh_TW'
import {finance} from './finance/zh_TW'
import {user} from './user/zh_TW'
export const M = Object.assign(
  {},
  fromApi,
  common,
  footerInfo,
  home,
  OTC,
  personal,
  trade,
  finance,
  user
)

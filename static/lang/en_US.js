import {fromApi} from './fromApi/en_US'
import {common} from './common/en_US'
import {footerInfo} from './footerInfo/en_US'
import {home} from './home/en_US'
import {OTC} from './OTC/en_US'
import {personal} from './personal/en_US'
import {trade} from './trade/en_US'
import {finance} from './finance/en_US'
import {user} from './user/en_US'
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

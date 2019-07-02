import {fromApi} from './fromApi/vi'
import {common} from './common/vi'
import {footerInfo} from './footerInfo/vi'
import {home} from './home/vi'
import {OTC} from './OTC/vi'
import {personal} from './personal/vi'
import {trade} from './trade/vi'
import {finance} from './finance/vi'
import {user} from './user/vi'
import {actionCenter} from './actionCenter/vi'
import {superNodes} from './superNodes/vi'
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
  user,
  actionCenter,
  superNodes
)

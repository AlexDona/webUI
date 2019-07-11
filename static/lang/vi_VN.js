import {fromApi} from './fromApi/vi_VN'
import {common} from './common/vi_VN'
import {footerInfo} from './footerInfo/vi_VN'
import {home} from './home/vi_VN'
import {OTC} from './OTC/vi_VN'
import {personal} from './personal/vi_VN'
import {trade} from './trade/vi_VN'
import {finance} from './finance/vi_VN'
import {user} from './user/vi_VN'
import {actionCenter} from './actionCenter/vi_VN'
import {superNodes} from './superNodes/vi_VN'
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

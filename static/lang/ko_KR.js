import {fromApi} from './fromApi/ko_KR'
import {common} from './common/ko_KR'
import {footerInfo} from './footerInfo/ko_KR'
import {home} from './home/ko_KR'
import {OTC} from './OTC/ko_KR'
import {personal} from './personal/ko_KR'
import {trade} from './trade/ko_KR'
import {finance} from './finance/ko_KR'
import {user} from './user/ko_KR'
import {actionCenter} from './actionCenter/ko_KR'
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
  actionCenter
)

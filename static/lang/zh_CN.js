import {fromApi} from './fromApi/zh_CN'
import {common} from './common/zh_CN'
import {footerInfo} from './footerInfo/zh_CN'
import {home} from './home/zh_CN'
import {OTC} from './OTC/zh_CN'
import {personal} from './personal/zh_CN'
import {trade} from './trade/zh_CN'
import {finance} from './finance/zh_CN'
export const M = Object.assign(
  fromApi,
  common,
  footerInfo,
  home,
  OTC,
  personal,
  trade,
  finance
)

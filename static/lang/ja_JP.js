import {fromApi} from './fromApi/ja_JP'
import {common} from './common/ja_JP'
import {footerInfo} from './footerInfo/ja_JP'
import {home} from './home/ja_JP'
import {OTC} from './OTC/ja_JP'
import {personal} from './personal/ja_JP'
import {trade} from './trade/ja_JP'
import {finance} from './finance/ja_JP'
import {user} from './user/ja_JP'
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

/**
 * api接口文档
 * */
import {post, get} from './axios'

export const changeLang = (params) => {
  return post('real/switchlan', params)
}

export const getCnyRate = () => get('real/CNYRate', {})

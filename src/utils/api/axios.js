/**
 *请求封装
 */
import {
  apiCommonUrl,
  xDomain
} from '../env'
import {
  setCookie,
  getCookie,
  removeCookie
} from '../index'
// eslint-disable-next-line
import {getNestedData} from '../commonFunc'
import _ from 'lodash'
import axios from 'axios'
import storeCreator from '../../vuex'
// import {routesVariable} from '../../router/routesVariable'

const store = storeCreator()
let util = {}
util.ajax = axios.create({
  baseURL: apiCommonUrl,
  timeout: 30000,
  withCredentials: true
})
let token
/**
 *   const url = `${config.url}`
 let needLoading = getNestedData(config.params, 'loading') || getNestedData(config.data, 'loading') || url.endsWith('user/userLoginForStep1')
 if (getNestedData(config.params, 'loading')) delete config.params.loading
 if (getNestedData(config.data, 'loading')) delete config.data.loading
 if (needLoading) {
    store.commit('CHANGE_AJAX_READY_STATUS', true)
  }
 */
// const notNeedLoadings = [routesVariable.]
util.ajax.interceptors.request.use((config) => {
  let notNeedLoading = _.get(config.params, 'not-loading')
  notNeedLoading ? delete config.params['not-loading'] : store.commit('SET_REQUEST_COUNT_M', 'ADD')
  token = getCookie('token')
  config.headers['x-domain'] = xDomain
  let userToken = store.state.user.loginStep1Info.token
  config.headers['token'] = token || userToken
  return config
}, (error) => {
  return error
})

util.ajax.interceptors.response.use(
  response => {
    if (response.headers.token) {
      token = response.headers.token
      setCookie('token', token)
    }
    if (response.config.url.endsWith('logout')) {
      removeCookie('token')
    }
    if (!response.data) {
      response.data = {}
    }
    store.commit('SET_REQUEST_COUNT_M', 'SUBTRACT')
    return response
  },
  error => {
    store.commit('SET_REQUEST_COUNT_M', 'RESET')
    return error.response // 返回接口返回的错误信息
  })

export const post = (url, params) => {
  return util.ajax({
    method: 'post',
    url,
    data: params
  })
}
export const put = (url, params) => {
  return util.ajax({
    method: 'put',
    url,
    data: params
  })
}
export const postWithURLencoded = (url, params) => {
  return util.ajax({
    method: 'post',
    url,
    params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
export const postWithFormData = (url, params) => {
  return util.ajax({
    method: 'post',
    url,
    data: params,
    headers: {
      'Content-Type': 'application/form-data'
    }
  })
}
export const get = (url, params) => {
  return util.ajax({
    method: 'get',
    url,
    params
  })
}
export const deleteMethod = (url, params) => {
  return util.ajax({
    method: 'delete',
    url,
    data: params,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

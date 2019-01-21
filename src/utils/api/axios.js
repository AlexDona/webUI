/**
 *请求封装
 */
import {
  apiCommonUrl,
  xDomain
} from '../env'
import {
  setCookie,
  getCookie
} from '../index'
import {getNestedData} from '../commonFunc'
import axios from 'axios'
import storeCreater from '../../vuex'

const store = storeCreater()
let util = {}
util.ajax = axios.create({
  baseURL: apiCommonUrl,
  timeout: 30000,
  withCredentials: true
})
let token = getCookie('token')
util.ajax.interceptors.request.use((config) => {
  const url = `${config.url}`
  let needLoading = getNestedData(config.params, 'loading') || getNestedData(config.data, 'loading') || url.endsWith('user/userLoginForStep1')

  if (needLoading) {
    store.commit('CHANGE_AJAX_READY_STATUS', true)
    console.log(store.state.common.isAjaxReady)
  }
  console.log(token)
  config.headers['x-domain'] = xDomain
  let userToken = store.state.user.loginStep1Info.token
  config.headers['token'] = token || userToken

  console.log(config)
  return config
}, (error) => {
  return error
})

util.ajax.interceptors.response.use(
  response => {
    console.log(response.headers.token)
    if (response.headers.token) {
      token = response.headers.token
      console.log(token)
      setCookie('token', token)
    }
    if (!response.data) {
      response.data = {}
    }
    store.commit('CHANGE_AJAX_READY_STATUS', false)
    return response
  },
  error => {
    console.dir(error)
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

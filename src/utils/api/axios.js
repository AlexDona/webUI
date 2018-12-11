/**
 *请求封装
 */
import {
  apiCommonUrl,
  xDomain
} from '../env'
import {getNestedData} from '../commonFunc'
import axios from 'axios'
import store from '../../vuex'
let failureCount = 0
let util = {}
util.ajax = axios.create({
  baseURL: apiCommonUrl,
  timeout: 30000,
  withCredentials: true
})

util.ajax.interceptors.request.use((config) => {
  let needLoading = !getNestedData(config.params, 'not-loading')
  console.log(needLoading)
  if (needLoading) {
    store.commit('common/CHANGE_AJAX_READY_STATUS', true)
    console.log(store.state.common.isAjaxReady)
  }
  if (failureCount > 1) {
    failureCount = 0
    return false
  }
  config.headers['x-domain'] = xDomain
  if (store.state.user.loginStep1Info.token) {
    let userToken = store.state.user.loginStep1Info.token
    config.headers['token'] = userToken
  }
  return config
}, (error) => {
  return error
})

util.ajax.interceptors.response.use(
  response => {
    if (!response.data) {
      response.data = {}
    }
    const success = response.data.meta.success
    if (!success) {
      failureCount++
    }

    store.commit('common/CHANGE_AJAX_READY_STATUS', false)
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
    data: params,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}
export const put = (url, params) => {
  return util.ajax({
    method: 'put',
    url,
    data: params,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
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

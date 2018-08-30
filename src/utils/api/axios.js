/**
 *请求封装
 */
import {baseUrl} from '../env'
import axios from 'axios'
// import store from '../../vuex'
import router from '../../router/index'
// import {getStoreWithJson} from '../index'

let util = {}
util.ajax = axios.create({
  baseURL: baseUrl,
  timeout: 30000
})

util.ajax.interceptors.request.use((config) => {
  // 商户id
  config.headers['partnerId'] = '474629374641963008'
  config.headers['partnerNo'] = '100001'

  // let userToken = getStoreWithJson('loginStep1Info').token || store.user.loginStep1Info.token || ''
  // console.log(userToken)
  // if (userToken) {
  //   config.headers['authorization'] = userToken
  // }
  return config
}, (error) => {
  return Promise.reject(error)
})

util.ajax.interceptors.response.use(
  response => {
    console.log(response)
    return response
  },
  error => {
    console.dir(error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
        // error.response.data.msg = '您的账号已在其他终端登录，如非本人操作，则密码可能已泄露，请重置密码！'
        // 返回 401 清除token信息并跳转到登录页面
        // localStorage.clear()
        // store.commit('userLogOut')
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
        // return Promise.reject("您的账号已在其他终端登录，如非本人操作，则密码可能已泄露，请重置密码！")
      }
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
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

export const get = (url, params) => {
  return util.ajax({
    method: 'get',
    url,
    params
  })
}

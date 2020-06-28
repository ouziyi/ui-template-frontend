import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // let each request carry token
    // ['token'] is a custom headers key
    // please modify it according to the actual situation
    config.headers['token'] = getToken()
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not end with 00000, it is judged as an error.
    if (res && !res.msgCd.endsWith('00000')) {
      const msgInfo = res.msgInfo
      Message({
        message: msgInfo || 'Error',
        type: 'error',
        duration: 3 * 1000
      })

      // MON00003, token失效
      if (res && res.msgCd === 'MON00003') {
        // to re-login
        MessageBox.confirm('session过期,您已被登出,可以取消继续留在该页面,或者重新登录', '确认退出', {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/logout')
          store.dispatch('tagsView/delAllViews')
          this.$router.push('/login')
        }).catch(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msgInfo || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // console.log('err' + error) // for debug
    Message({
      message: error.message || '网络异常,请检查网络',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

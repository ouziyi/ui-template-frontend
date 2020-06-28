import axios from 'axios'
import { getToken } from '@/utils/auth'

// create an axios instance
const uploadRequest = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000, // request timeout
  withCredentials: true
})

export const uploadExcel = data => uploadRequest(
  { url: '/demo/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf-8'
    },
    data }
)

export function downloadExcel(data) {
  return uploadRequest({
    url: '/demo/download',
    method: 'post',
    responseType: 'blob',
    data
  })
}

uploadRequest.interceptors.request.use(
  config => {
    config.headers['token'] = getToken()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

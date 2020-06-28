import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import JSEncrypt from 'jsencrypt'

import '@/icons' // icon
import '@/permission' // permission control
import { isAuth } from '@/utils/auth'

// set ElementUI lang to zh_CN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false
// 挂载全局
Vue.prototype.isAuth = isAuth // 权限方法

Vue.prototype.$getRsaCode = function(str, pubKey) { // 注册方法
  const encryptStr = new JSEncrypt()
  encryptStr.setPublicKey(pubKey) // 设置 加密公钥
  const data = encryptStr.encrypt(str) // 进行加密
  return data
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

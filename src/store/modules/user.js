import { login, logout, getInfo } from '@/api/user'
import { nav } from '@/api/menu'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    var { username, password, verifyCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, verifyCode: verifyCode.trim() }).then(response => {
        if (!response) {
          reject('网络异常,请检查网络')
        }
        setToken(response.body.sessionId)
        resolve(response.body.msgCd)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getPermission({ commit }) {
    return new Promise((resolve, reject) => {
      nav().then(response => {
        sessionStorage.setItem('menuList', JSON.stringify(response.body.menusList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(response.body.permissions || '[]'))
        resolve(response.body.menusList)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if (!response) {
          reject('获取用户详情失败,请重新登陆')
        }
        // 假设写死
        commit('SET_ROLES', ['developer'])
        commit('SET_NAME', response.body.username)
        // 假设写死
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        // commit('SET_TOKEN', '')
        commit('SET_ROLES', undefined)
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


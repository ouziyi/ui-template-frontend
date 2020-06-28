import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'

/**
 * 递归组装路由表，返回符合用户角色权限的路由表（路由表后端配置时使用）
 * @param resources
 */
function assembleAsyncRoutes(resources) {
  const accessedRouters = []
  resources.forEach(resource => {
    var route = {}
    if (resource.resourceUrl.indexOf('Layout') >= 0) {
      route = {
        path: '/' + resource.resourcePath,
        component: Layout,
        redirect: resource.redirectUrl,
        name: resource.resourcePageName,
        meta: {
          title: resource.resourceName,
          icon: resource.resourceIcon
        }
      }
    } else if (resource.resourceUrl.indexOf('nested') >= 0 && resource.children && resource.children.length) { // 包含子菜单的二级以下菜单
      route = {
        path: resource.resourcePath,
        component: (resolve) => require([`@/views/${resource.resourceUrl}`], resolve),
        redirect: resource.redirectUrl,
        name: resource.resourcePageName,
        meta: {
          title: resource.resourceName,
          noCache: !resource.resourceCache,
          icon: resource.resourceIcon
        },
        hidden: !resource.resourceShow
      }
    } else { // 最后一层菜单
      route = {
        path: resource.resourcePath,
        component: (resolve) => require([`@/views/${resource.resourceUrl}`], resolve),
        name: resource.resourcePageName,
        meta: {
          title: resource.resourceName,
          noCache: !resource.resourceCache,
          icon: resource.resourceIcon
        },
        hidden: !resource.resourceShow
      }
    }

    if (resource.children && resource.children.length) {
      route.children = assembleAsyncRoutes(resource.children)
    }
    accessedRouters.push(route)
  })
  return accessedRouters
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateResourcesRoutes({ commit }, resources) {
    return new Promise(resolve => {
      let accessedRoutes
      if (resources && resources.length > 0) {
        accessedRoutes = asyncRoutes.concat(assembleAsyncRoutes(resources))
      }
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

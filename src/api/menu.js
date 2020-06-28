import request from '@/utils/request'

export function nav() {
  return request({
    url: '/menu/nav',
    method: 'get'
  })
}

export function getMenus() {
  return request({
    url: '/menu/list',
    method: 'get'
  })
}

export function deleteMenu(menuId) {
  return request({
    url: `/menu/delete/${menuId}`,
    method: 'delete'
  })
}

export function selectMenu() {
  return request({
    url: '/menu/select',
    method: 'get'
  })
}

export function getMenuInfo(menuId) {
  return request({
    url: `/menu/info/${menuId}`,
    method: 'get'
  })
}

export function menuSaveOrUpdate(id, data) {
  return request({
    url: `/menu/${!id ? 'save' : 'update'}`,
    method: 'post',
    data: { body: data }
  })
}

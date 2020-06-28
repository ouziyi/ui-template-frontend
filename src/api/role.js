import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/role/select',
    method: 'get'
  })
}

export function getPageRoles(data) {
  return request({
    url: '/role/list',
    method: 'post',
    data: { body: data }
  })
}

export function deleteRole(ids) {
  return request({
    url: '/role/delete',
    method: 'delete',
    data: { body: ids }
  })
}

export function getRoleInfo(id) {
  return request({
    url: `/role/info/${id}`,
    method: 'get'
  })
}

export function addOrUpdate(id, data) {
  return request({
    url: `/role/${!id ? 'save' : 'update'}`,
    method: 'post',
    data: { body: data }
  })
}

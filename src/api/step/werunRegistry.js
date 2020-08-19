import request from '@/utils/request'

// 查询注册用户列表
export function listUser(query) {
  return request({
    url: '/mp/werun-registry/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getPost(postId) {
  return request({
    url: '/mp/werun-registry/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/mp/werun-registry',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(postId) {
  return request({
    url: '/mp/werun-registry/' + postId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/mp/werun-registry/export',
    method: 'get',
    params: query
  })
}
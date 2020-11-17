import request from '@/utils/request'

// 查询总排行列表
export function listWerun(query) {
    return request({
        url: '/mp/werun-history/rank-total',
        method: 'get',
        params: query
    })
}
// 查询注册用户列表
export function listUser(query) {
    return request({
        url: '/mp/werun-registry/list',
        method: 'get',
        params: query
    })
}

// 查询运动详细
export function getWerun(postId) {
    return request({
        url: '/mp/werun-history/' + postId,
        method: 'get'
    })
}

// 新增岗位
export function addWerun(data) {
    return request({
        url: '/mp/werun-history',
        method: 'post',
        data: data
    })
}

// 修改运动信息
export function updateWerun(data) {
    return request({
        url: '/mp/werun-history',
        method: 'put',
        data: data
    })
}

// 删除岗位
export function delWerun(postId) {
    return request({
        url: '/mp/werun-history/' + postId,
        method: 'delete'
    })
}

// 导出岗位
export function exportWerun(query) {
    return request({
        url: '/mp/werun-history/export',
        method: 'get',
        params: query
    })
}
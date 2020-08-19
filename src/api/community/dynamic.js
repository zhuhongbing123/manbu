import request from '@/utils/request'

// 查询新闻动态列表
export function listDynamic(query) {
    return request({
        url: '/gd/activity/list',
        method: 'get',
        params: query
    })
}

// 新增新闻动态
export function addDynamic(data) {
    return request({
        url: '/gd/activity',
        method: 'post',
        data: data
    })
}

// 查询动态详细
export function getDynamic(postId) {
    return request({
        url: '/gd/activity/' + postId,
        method: 'get'
    })
}
// 修改动态
export function updateDynamic(data) {
    return request({
        url: '/gd/activity',
        method: 'put',
        data: data
    })
}

// 导出动态
export function exportDynamic(query) {
    return request({
        url: '/gd/activity/export',
        method: 'get',
        params: query
    })
}

// 删除动态
export function delDynamic(postId) {
    return request({
        url: '/gd/activity/' + postId,
        method: 'delete'
    })
}


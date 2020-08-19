import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
    return request({
        url: '/mp/user/list',
        method: 'get',
        params: query
    })
}

// 新增用户
export function addUser(data) {
    return request({
        url: '/mp/user',
        method: 'post',
        data: data
    })
}

// 查询用户详细
export function getPost(postId) {
    return request({
        url: '/mp/user/' + postId,
        method: 'get'
    })
}

// 修改用户
export function updateUser(data) {
    return request({
        url: '/mp/user',
        method: 'put',
        data: data
    })
}

// 导出用户
export function exportUser(query) {
    return request({
        url: '/mp/user/export',
        method: 'get',
        params: query
    })
}

// 转换时间
export function getDate(date) {
    if (!date) {
        date = new Date()
    }
    if (typeof date !== 'object') {
        date = date.replace(/-/g, '/')
    }
    const dd = new Date(date)
    const y = dd.getFullYear()
    const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
    const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
    const hours = dd.getHours() < 10 ? '0' + dd.getHours() : dd.getHours();
    const minutes = dd.getMinutes() < 10 ? '0' + dd.getMinutes() : dd.getMinutes();
    const seconds = dd.getSeconds() < 10 ? '0' + dd.getSeconds() : dd.getSeconds();
    return {
        fullDate: y + '-' + m + '-' + d,
        year: y,
        month: m,
        date: d,
        day: dd.getDay(),
        fullTime: y + '-' + m + '-' + d + ' ' + hours + ':' + minutes + ":" + seconds
    }
}

